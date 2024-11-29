const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/initiate-all", async (req, res) => {
    const initiateResult = await appService.initiateAll();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-performer", async (req, res) => {
    const { id, name, debutYear, numOfFans, groupId} = req.body;
    const insertResult = await appService.insertPerformer(id, name, debutYear, numOfFans, groupId);
    if (insertResult && insertResult.error) {
        res.status(500).json({ success: false, error: insertResult.error.message });
    } else {
        
        res.json({ success: true, result: insertResult });
    }
});

router.post("/update-performer", async (req, res) => {
    console.log("in app controller");
    const { performerID, performer_name, debut_year, num_fans, groupID } = req.body;
    console.log(performerID);
    const updateResult = await appService.updatePerformer(performerID, performer_name, debut_year, num_fans, groupID);
    console.log(updateResult);
    if (updateResult) {
        res.json({ success: true, result: updateResult });
    } else {
        res.status(500).json({ success: false, message: "An error occurred while updating the performer" });
    }
});

router.post("/delete-performer", async (req, res) => {
    console.log("in app controller");
    console.log(req);
    const {condition} = req.body;
    console.log(condition);
    const deleteResult = await appService.deletePerformer(condition);
    console.log(deleteResult);
    if (deleteResult && deleteResult.error) {
        res.status(500).json({ success: false, error: deleteResult.error.message });
    } else {
        res.json({ success: true, result: deleteResult });
    }
});

router.post("/select-performer", async (req, res) => {
    const {condition} = req.body;
    console.log("Received condition clause in appController now is :", condition); // Log received condition
    const selectResult = await appService.selectPerformer(condition);

    if (selectResult && selectResult.error) {
        res.status(500).json({ success: false, error: selectResult.error.message });
    } else {
        
        res.json({ success: true, result: selectResult });
    }

});

router.post("/project-performer", async (req, res) => {
    console.log("in app controller");
    console.log(req);
    const {columns} = req.body;
    console.log(columns);
    const projectResult = await appService.projectPerformer(columns);
    console.log(projectResult);
    if (projectResult && projectResult.error) {
        res.status(500).json({ success: false, error: projectResult.error.message });
    } else {
        res.json({ success: true, result: projectResult });
    }
});

router.post("/join-performer", async (req,res) => {
    const {performerID} = req.body;
    console.log("In app controller");
    const songNameResult = await appService.joinPerformerWithGroup(performerID);
    console.log(songNameResult);
    if (songNameResult) {
        res.json({ success: true, result: songNameResult });
    } else {
        res.status(500).json({ success: false, message: "An error occurred while retrieving songs" });
    }
});

router.get('/aggregation-groupby', async(req, res) => {
    console.log("Received aggregation-groupby"); 
    const aggregationResult = await appService.aggregationGroupby();
    console.log(aggregationResult);

    if (aggregationResult && aggregationResult.error) {
        res.status(500).json({ success: false, error: aggregationResult.error.message });
    } else {
        
        res.json({ success: true, result: aggregationResult });
    }
});

router.post("/aggregation-having", async (req, res) => {
    const {minFans} = req.body;
    console.log("Received aggregation-groupby-having");
    const fanCountResult = await appService.performerGroupByFanCount(minFans); 
    console.log(fanCountResult);

    if (!fanCountResult) {
        res.status(500).json({ success: false, message: "An error occured while retrieving fan count" });
    } else {
        res.json({ success: true, result: fanCountResult });
    }
});

router.post("/nestedAggregation-performer", async (req, res) => {
    console.log("in app controller");
    console.log(req);
    const {group_by, generalSign, havingSign, havingConstraint, select} = req.body;
    console.log(group_by, generalSign, havingSign, havingConstraint, select);
    const nestedAggregationResult = await appService.nestedAggregation(group_by, generalSign, havingSign, havingConstraint, select);
    console.log(nestedAggregationResult);
    if (nestedAggregationResult && nestedAggregationResult.error) {
        res.status(500).json({ success: false, error: nestedAggregationResult.error.message });
    } else {
        res.json({ success: true, result: nestedAggregationResult });
    }
});

router.get('/division', async(req, res) => {
    console.log("Received division");
    const divisionResult = await appService.division();
    console.log(divisionResult);

    if (divisionResult && divisionResult.error) {
        res.status(500).json({ success: false, error: divisionResult.error.message });
    } else {

        res.json({ success: true, result: divisionResult });
    }

})

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

// test GET 
router.get('/test', (req, res) => {
    console.log("Received test GET request");
    res.json({ message: "GET request is working!", data: ["Sample data"] });
});

// Middleware to validate table names
// Important to prevent unexpected behavious
// Put validateTableName and dynamic router in the end
const validateTableName = (req, res, next) => {
    // console.log("Table name received:", req.params.tableName);
    const validTables = ['performer_group', 'performer', 'song', 'artist', 'match_date', 'demotable']; 
    if (!validTables.includes(req.params.tableName)) {

        return res.status(404).json({ error: 'Invalid table name' });
    }
    next();
};


router.get('/:tableName', validateTableName, async (req, res) => {
    const { tableName } = req.params;
    const tableContent = await appService.fetchTableFromDb(tableName);
    res.json({data: tableContent});
});

// Catch invalid routes
router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});



module.exports = router;