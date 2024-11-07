/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

async function fetchAndDisplayTable(tableId, endpoint) {
    const tableElement = document.getElementById(tableId);
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch(endpoint, {
        method: 'GET'
    });
    const responseData = await response.json();
    const tableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    tableContent.forEach(rowData => {
        const row = tableBody.insertRow();
        rowData.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}


// This function resets or initializes the performer.
async function resetAll() {
    const response = await fetch("/initiate-all", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetAllResultMsg');
        messageElement.textContent = "all tables initiated successfully!";
        fetchPerformerTableData();
    } else {
        alert("Error initiating all table!");
    }
}

async function addACondition() {

    const container = document.getElementById("selection-container");
    const newConditionContainer = document.createElement("div");
    newConditionContainer.classList.add("condition-container");
    
    // container.classList.add(".selection-container");

    const newAndOrDropdown = document.createElement("select");
    newAndOrDropdown.classList.add("andor-dropdown");
    newAndOrDropdown.innerHTML = `
        <select class="andor-dropdown">
        <option value="AND">AND</option>
        <option value="OR">OR</option>` ;

    const newAttributeDropdown = document.createElement("select");
    newAttributeDropdown.classList.add("attribute-dropdown");
    newAttributeDropdown.innerHTML = `
        <option value="performerID">performerID</option>
        <option value="performer_name">performer_name</option>
        <option value="debut_year">debut_year</option>
        <option value="num_fans">num_fans</option>
        <option value="groupID">groupID</option>` ;

    const new0peratorDropdown = document.createElement("select");
    new0peratorDropdown.classList.add("operator-dropdown");
    new0peratorDropdown.innerHTML = `<option value="=">=</option>
         <option value="!=">!=</option>
         <option value="<"><</option>
         <option value=">">></option>
         <option value="<="><=</option>
         <option value=">=">>=</option>`;

    const newValueInput = document.createElement("input");
    // newValueInput.innerHTML = `<input type="text" class="value-input" placeholder="Value">`;
    newValueInput.type = "text";
    newValueInput.classList.add("value-input");
    newValueInput.placeholder = "Value";

    // const newConditionContainer = document.createElement("div");
    newConditionContainer.appendChild(newAndOrDropdown);
    newConditionContainer.appendChild(newAttributeDropdown);
    newConditionContainer.appendChild(new0peratorDropdown);
    newConditionContainer.appendChild(newValueInput);
    container.appendChild(newConditionContainer);
}


// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Inserts new records into the performer table.
async function insertPerformer(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertPerformerId').value;
    const nameValue = document.getElementById('insertPerformerName').value;
    const debutYearValue = document.getElementById('insertDebutYear').value;
    const numOfFansValue = document.getElementById('insertNumOfFans').value;
    const groupIdValue = document.getElementById('insertGroupId').value;

    const response = await fetch('/insert-performer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue,
            debutYear: debutYearValue,
            numOfFans: numOfFansValue,
            groupId: groupIdValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertPerformerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        // fetchPerformerTableDataData();
        fetchTableData;
    } else {
        // messageElement.textContent = "Error inserting data!";
        const errorMessage = responseData.error ? responseData.error : "Error inserting data!";
        messageElement.textContent = errorMessage;
    }
}


// Selects from performer table based on conditions.
async function selectPerformer(event) {
    // console.log("Function `selectPerformer` triggered."); // Log function start


    event.preventDefault();
    console.log(document.querySelectorAll('.condition-container'));
    const conditionClause = [];
    // use querySelectorAll instead of getElementById to select all
    // const allSelectionContainer = document.querySelectorAll('.selection-container').value;
    const allSelectionContainer = document.querySelectorAll('.condition-container');
    console.log("Number of `.condition-container` elements found:", allSelectionContainer.length);

    if (allSelectionContainer.length === 0) {
        console.error("No elements with class 'condition-container' found.");
        return;
    }

    allSelectionContainer.forEach((selectionContainer, index) => {
        // console.log(index);
        // console.log(selectionContainer);
        // console.log("=================");
        if (index > 0) {
            const andorValue = selectionContainer.querySelector('.andor-dropdown')?.value || "";
            conditionClause.push(andorValue);    
        }
        

        const attValue = selectionContainer.querySelector('.attribute-dropdown').value;
        const opValue = selectionContainer.querySelector('.operator-dropdown').value;
        const inputValue = selectionContainer.querySelector('.value-input').value;

        const formattedInputValue = isNaN(inputValue) ? `'${inputValue}'` : inputValue;

        const conditionString = `${attValue} ${opValue} ${formattedInputValue}`;

        conditionClause.push(conditionString);
    
    })

    const fullCondition = conditionClause.join(" ");
    // console.log("Final SQL Condition Clause:", fullCondition);
    const response = await fetch('/select-performer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            condition: fullCondition
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('selectPerformerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "The select result is:";

        const resultContainer = document.createElement('div');

        if (responseData.result.length === 0){
            const resultRow = document.createElement('div');
            resultRow.textContent = "No Result Found";
            resultContainer.appendChild(resultRow);
        } else {
            responseData.result.forEach(rowData => {
            const resultRow = document.createElement('div');
            resultRow.textContent = JSON.stringify(rowData);
            resultContainer.appendChild(resultRow);
            });
        }

        messageElement.appendChild(resultContainer);

        // fetchTableData();
    } else {
        const errorMessage = responseData.error ? responseData.error : "Error selecting data!";
        messageElement.textContent = errorMessage;
    }
}



// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    console.log("responseData for countDemotable is: ");
    console.log(responseData);
    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}

async function aggregationGroupby(event) {
    event.preventDefault();
    console.log("aggregationGroupby start");
    const response = await fetch("/aggregation-groupby", {
        method: 'GET'
    });
    console.log("response is :");
    console.log(response);  
    console.log(response.success);  
    const responseData = await response.json();
    const messageElement = document.getElementById('aggregationGroupbyResultMsg');

    if (responseData.success) {
        messageElement.textContent = "The result is:";

        const resultContainer = document.createElement('div');

        if (responseData.result.length === 0){
            const resultRow = document.createElement('div');
            resultRow.textContent = "No Result Found";
            resultContainer.appendChild(resultRow);
        } else {
            // Create a table to put the results with headers
            const resultTable = document.createElement('table');
            resultTable.setAttribute("border", "1");
            const headerRow = document.createElement('tr');
            const groupIDHeader = document.createElement('th');
            groupIDHeader.textContent = 'Group ID';
            const minFansHeader = document.createElement('th');
            minFansHeader.textContent = 'Minimum Fans';

            // put <th> in <tr>
            headerRow.appendChild(groupIDHeader);
            headerRow.appendChild(minFansHeader);

            // put <tr> in <table>
            resultTable.appendChild(headerRow);

            responseData.result.forEach(rowData => {
                // const resultRow = document.createElement('div');
                // resultRow.textContent = JSON.stringify(rowData);
                // resultContainer.appendChild(resultRow);
                const row = document.createElement('tr');
            
                const groupIDCell = document.createElement('td');
                groupIDCell.textContent = rowData[0];
                
                const minFansCell = document.createElement('td');
                minFansCell.textContent = rowData[1];
                
                row.appendChild(groupIDCell);
                row.appendChild(minFansCell);
                resultTable.appendChild(row);
            });
            resultContainer.appendChild(resultTable);
        }

        messageElement.appendChild(resultContainer);
        fetchTableData;




        // console.log("aggregationGroupby success");

        // messageElement.textContent = `The result is: ${responseData.result}`;
        // fetchPerformerTableDataData();
        // fetchTableData;
    } else {

        // // messageElement.textContent = "Error inserting data!";
        // console.log("aggregationGroupby fail");
        // console.log("responseData is :");
        // console.log(responseData);
        const errorMessage = responseData.error ? responseData.error : "Error aggregationGroupby!";
        messageElement.textContent = errorMessage;
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
//    fetchPerformerTableData();

    fetchAllTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("resetAll").addEventListener("click", resetAll);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("insertPerformer").addEventListener("submit", insertPerformer);
    document.getElementById("selectPerformer").addEventListener("submit", selectPerformer);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("aggregationGroupby").addEventListener("click", aggregationGroupby);
};

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}


function fetchAllTableData() {
//    fetchAndDisplayTable('demotable', '/demotable');
    fetchAndDisplayTable('performer_table', '/performer');
    fetchAndDisplayTable('performer_group_table', '/performer_group');
    fetchAndDisplayTable('match_date_table', '/match_date');
    fetchAndDisplayTable('song_table', '/song');
    fetchAndDisplayTable('artist_table', '/artist');
}
