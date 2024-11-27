const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function fetchTableFromDb(tableName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT * FROM ${tableName}`);
        // const result = await connection.execute('SELECT * FROM artist');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

// Initiate all tables from a .sql file
const fs = require('fs').promises;
const path = require('path');

async function initiateAll() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE Performer`);
        } catch (err) {
            console.log('Table Performer might not exist, proceeding to next...');
        }

        try {
            await connection.execute(`DROP TABLE Performer_Group`);
        } catch (err) {
            console.log('Table Performer_Group might not exist, proceeding to next...');
        }

        try {
            await connection.execute(`DROP TABLE Song`);
        } catch (err) {
            console.log('Table Song might not exist, proceeding to next...');
        }

        try {
            await connection.execute(`DROP TABLE Match_Date`);
        } catch (err) {
            console.log('Table Match_Date might not exist, proceeding to next...');
        }

        try {
            await connection.execute(`DROP TABLE Artist`);
        } catch (err) {
            console.log('Table Artist might not exist, proceeding to next...');
        }
        try {
            const sqlFilePath = path.join(__dirname, 'init_all.sql');
            const sql = await fs.readFile(sqlFilePath, 'utf8');
            const statements = sql.split(';');

            for (let statement of statements) {
                if (statement.trim()) {
                    await connection.execute(statement.trim());
                }
            }

            await connection.commit();
            console.log('Successfully initialized all tables and data.');

            return true;
        } catch (err) {
            console.log('Failed to initiate all tables', err);
        }

    }).catch((err) => {
        console.log('Error:', err);
        return false;
    });
}



async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertPerformer(id, name, debutYear, numOfFans, groupId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Performer VALUES (:id, :name, :debutYear, :numOfFans, :groupId)`,
            [id, name, debutYear, numOfFans, groupId],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error("InsertPerformer Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

async function updatePerformer(performerID, debut_year, num_fans, groupID) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `UPDATE Performer SET debut_year = :debut_year, num_fans = :num_fans, groupID = :groupID 
        WHERE performerID = :performerID`;

        console.log("Executing SQL Query:", sqlQuery);  
        const result = await connection.execute(sqlQuery,
        [ debut_year, num_fans, groupID, performerID ],
        { autoCommit: true }
      );
  
      return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
      return false;
    });
}

async function deletePerformer(condition) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `DELETE FROM Performer WHERE ${condition}`;
        console.log("Executing SQL Query:", sqlQuery); 

        const result = await connection.execute(sqlQuery);
        await connection.commit();
        return result;
    }).catch((error) => {
        console.error("deletePerformer Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

//TODO
async function selectPerformer(condition) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `SELECT * FROM Performer WHERE ${condition}`;
        console.log("Executing SQL Query:", sqlQuery); 

        const result = await connection.execute(sqlQuery);

        return result.rows;
    }).catch((error) => {
        console.error("SelectPerformer Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

async function projectPerformer(columns) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `SELECT ${columns} FROM Performer`;
        console.log("Executing SQL Query:", sqlQuery); 

        const result = await connection.execute(sqlQuery);

        return result.rows;
    }).catch((error) => {
        console.error("projectPerformer Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

async function joinPerformer(performerID) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `
        SELECT DISTINCT g.song_name
        FROM Performer p, Performer_Group g
        WHERE performerID = :performerID and p.groupID = g.groupID`;

        console.log("Executing SQL Query:", sqlQuery); 
        
        const result = await connection.execute(sqlQuery, {performerID});

        console.log(result); 
  
        return result.rows;
    }).catch(() => {
      return false;
    });
}


async function aggregationGroupby() {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `SELECT groupID, MIN(num_fans) AS min_fan FROM Performer GROUP BY groupID`;
        console.log("Executing SQL Query:", sqlQuery); 

        const result = await connection.execute(sqlQuery);

        return result.rows;
    }).catch((error) => {
        console.error("aggregationGroupby Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

async function aggregationHaving(minFans) {
    return await withOracleDB(async (connection) => {
        const sqlQuery = `
        SELECT groupID, SUM(num_fans) AS fans
        FROM Performer
        GROUP BY groupID
        HAVING SUM(num_fans) >= :minFans`;
        console.log("Executing SQL Query:", sqlQuery);
        const result = await connection.execute(sqlQuery, { minFans });
        console.log(result);
        return result.rows;
    }).catch(() => {
        console.log("!performerGroupFanCount error! :");
        return false;
    })
}

async function nestedAggregation(group_by, generalSign, havingSign, havingConstraint, select) {
    return await withOracleDB(async (connection) => {
        const subQuery = `SELECT ${generalSign}(num_fans) FROM Performer`;
        const sqlQuery = `SELECT P.${group_by}, ${select} FROM Performer P GROUP BY P.${group_by} HAVING ${havingSign}(P.num_fans) ${havingConstraint} (${subQuery})`;
        console.log("subquery: ", subQuery);
        console.log("SQL Query: ", sqlQuery);

        const result = await connection.execute(sqlQuery);
        return result.rows;
    }).catch((error) => {
        console.error("nested aggregation error: ", error);
        return {error};
    })
}

async function division() {
    return await withOracleDB(async (connection) => {
        // change EXCEPT TO MINUS
        const sqlQuery = `SELECT p.debut_year FROM Performer p WHERE NOT EXISTS (SELECT pg.groupID FROM Performer_Group pg
        MINUS SELECT p2.groupID FROM Performer p2 WHERE p2.debut_year = p.debut_year) GROUP BY p.debut_year`;

        console.log("Executing SQL Query:", sqlQuery);

        const result = await connection.execute(sqlQuery);

        return result.rows;
    }).catch((error) => {
        console.error("division Error:", error);
        // return error for the router to handle and show in front end
        return {error};
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    // return 4;
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}



module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    fetchTableFromDb,
    initiateDemotable,
    initiateAll,
    insertDemotable,
    insertPerformer,
    updatePerformer,
    deletePerformer,
    selectPerformer,
    projectPerformer,
    joinPerformer,
    aggregationGroupby,
    aggregationHaving,
    nestedAggregation,
    division,
    updateNameDemotable, 
    countDemotable,
};