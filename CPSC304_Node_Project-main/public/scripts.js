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
    // const tableElement = document.getElementById('demotable');
    // const tableBody = tableElement.querySelector('tbody');

    // const response = await fetch('/demotable', {
    //     method: 'GET'
    // });

    // const responseData = await response.json();
    // const demotableContent = responseData.data;

    // // Always clear old, already fetched data before new fetching process.
    // if (tableBody) {
    //     tableBody.innerHTML = '';
    // }

    // demotableContent.forEach(user => {
    //     const row = tableBody.insertRow();
    //     user.forEach((field, index) => {
    //         const cell = row.insertCell(index);
    //         cell.textContent = field;
    //     });
    // });
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

// This function resets or initializes the performer.
async function resetAll() {
    const response = await fetch("/initiate-all", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetAllResultMsg');
        messageElement.textContent = "all tables initiated successfully!";
        // fetchPerformerTableData();
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
    // error handling: if ID is less than 0
    if (parseInt(idValue, 10) < 0) {
        alert('Error: ID cannot be less than 0');
        return;
    }

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

async function updatePerformer(event) {
    event.preventDefault();
    const performerID = document.getElementById('performerID').value;
    const debutYearValue = document.getElementById('updateDebutYear').value;
    const numOfFansValue = document.getElementById('updateNumFans').value;
    const groupIdValue = document.getElementById('updateGroupID').value;

    const response = await fetch('/update-performer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            performerID: performerID,
            debut_year: debutYearValue,
            num_fans: numOfFansValue,
            groupID: groupIdValue
        })
    });
    const responseData = await response.json();
    const messageElement = document.getElementById('updatePerformerResultMsg');
    if (responseData.success) {
        messageElement.textContent = "Performer updated successfully!";

        fetchTableData;
    } else {
        messageElement.textContent = "Error updating performer!";
    }
}

async function deletePerformer(event) {
    console.log("in delete performer scripts.js");
    event.preventDefault();
    const allconditions = [];

    const performerID = document.getElementById("deletePerformerID").value;
    const performerName = document.getElementById("deletePerformerName").value;
    const debutYearConstraint = document.getElementById("debutYearConstraint").value;
    const debutYear = document.getElementById("deletePerformerDebutYear").value;
    const fansConstraint = document.getElementById("numberFansConstraint").value;
    const numberFans = document.getElementById("deletePerformerFans").value;
    const groupID = document.getElementById("deletePerformerGroup").value;
    
    if (performerID) {
        allconditions.push(`performerID = ${performerID}`);
    }
    if (performerName) {
        allconditions.push(`performer_name = "${performerName}"`);
    }
    if (debutYearConstraint != " " && debutYear) {
        if (debutYearConstraint == "<") {
            allconditions.push(`debut_year < ${debutYear}`);
        } else if (debutYearConstraint == "=") {
            allconditions.push(`debut_year = ${debutYear}`);
        } else {
            allconditions.push(`debut_year > ${debutYear}`);
        }
    }
    if (fansConstraint != " " && numberFans) {
        if (fansConstraint == "<") {
            allconditions.push(`num_fans < ${numberFans}`);
        } else if (fansConstraint == "=") {
            allconditions.push(`num_fans = ${numberFans}`);
        } else {
            allconditions.push(`num_fans > ${numberFans}`);
        }
    }
    if (groupID) {
        allconditions.push(`groupID = ${groupID}`);
    }
    console.log(allconditions);
    const messageElement = document.getElementById('deletePerformerResultMsg');
    if (allconditions.length == 0) {
        messageElement.textContent = "Please enter at least one value";
    } else {
        fullcondition = allconditions.join(" and ");
        console.log(fullcondition);
        const response = await fetch('/delete-performer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                condition: fullcondition
            })
        });
        console.log("after fetch");
        console.log(response);
        const responseData = await response.json();
        console.log(responseData);
        messageElement.textContent = "TODO!!! on cascade delete";
        const resultContainer = document.createElement('div');
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

        const formattedInputValue = isNaN(inputValue) || attValue === "performer_name" ? `'${inputValue}'` : inputValue;

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
    console.log("await response");
    const responseData = await response.json();
    const messageElement = document.getElementById('selectPerformerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "The select result is:";

        const resultContainer = document.createElement('div');

        if (responseData.result.length === 0) {
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

async function projectPerformer(event) {
    console.log("in project performer scripts.js");
    event.preventDefault();
    selectedColumns = [];

    const checkboxes = document.querySelectorAll('input[name="performerAttributes"]:checked');
    checkboxes.forEach((checkbox) => {
        selectedColumns.push(checkbox.value);
    });
    const messageElement = document.getElementById('ProjectionPerformerResultMsg');
    if (selectedColumns.length == 0) {
        messageElement.textContent = "Please select at least one field.\n";
    } else {
        const selected = selectedColumns.join(', ');
        console.log(selected);
        const response = await fetch('/project-performer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                columns: selected
            })
        });
        console.log("after fetch");
        console.log(response);
        const responseData = await response.json();
        console.log(responseData);
        messageElement.textContent = "The select result is: (in order)";
        const resultContainer = document.createElement('div');
        if (responseData.result.length === 0) {
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
    }
}

async function joinPerformer(event) {
    event.preventDefault();
    const performerID = document.getElementById('joinPerformerID').value;
    const response = await fetch('/join-performer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ performerID: performerID })
    });

    console.log("after fetch");
    console.log(response);
    const responseData = await response.json();
    const messageElement = document.getElementById('joinPerformerResultMsg');
    console.log(responseData);
    console.log(" in scripts");
    if (responseData.success) {
        console.log("Full success now displaying song performed");
        messageElement.textContent = `Song performed: ${JSON.stringify(responseData.result)}`;
    } else {
        messageElement.textContent = "Error finding song!";
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

        if (responseData.result.length === 0) {
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

async function aggregationHaving(event) {
    event.preventDefault();
    const minFans = document.getElementById('minFans').value;
    const response = await fetch('/aggregation-having', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ minFans: minFans })
    });
    console.log("after fetch");
    console.log(response);
    const responseData = await response.json();
    const messageElement = document.getElementById('performerGroupByFanCountResultMsg');
    console.log(responseData);
    console.log(" in scripts");
    if (responseData.success) {
        console.log(" Full success now displaying fan counts");
        messageElement.textContent = `Fan counts: ${JSON.stringify(responseData.result)}`;
    } else {
        messageElement.textContent = "Error in finding number of fans with minimum";
    } 
}

async function nestedAggregationPerformer(event) {
    console.log("in nested aggregation performer scripts.js");
    event.preventDefault();
    selected = [];

    const group = document.getElementById("nestedAggregationGroupBy").value;
    const havingGroupSign = document.getElementById("nestedAggregationFansGroupSign").value;
    const havingGroupConstraint = document.getElementById("nestedAggregationFansGroupConstraint").value;
    const havingGeneralSign = document.getElementById("nestedAggregationFansGeneralSign").value;
    const countcheck = document.querySelector('input[id="nestedAggregationID"]:checked');
    if(countcheck) {
        selected.push(countcheck.value);
    }
    const checkboxes = document.querySelectorAll('input[name="nestedAggregationCheckboxes"]:checked');
    checkboxes.forEach((checkbox) => {
        const dropDownID = checkbox.id.replace("nestedAggregationFans", "nestedAggregationFansStat");
        const statDropdown = document.getElementById(dropDownID);
        selected.push(`${statDropdown.value}(P.num_fans)`);
        console.log(selected);
    });
    const messageElement = document.getElementById('nestedAggregationResultMsg');
    if (selected.length == 0) {
        messageElement.textContent = "Please select at least one column\n";
    } else {
        const selectClause = selected.join(', ');
        console.log(selected);
        const response = await fetch('/nestedAggregation-performer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                group_by: group,
                generalSign: havingGeneralSign,
                havingSign: havingGroupSign,
                havingConstraint: havingGroupConstraint,
                select: selectClause,
            })
        });
        // console.log("after fetch");
        console.log(response);
        const responseData = await response.json();
        console.log(responseData);
    
        messageElement.textContent = "The select result is: (first column is the debut year)";
    
        const resultContainer = document.createElement('div');
    
        if (responseData.result.length === 0) {
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
    }
}

async function division(event) {
    event.preventDefault();
    console.log("division start");
    const response = await fetch("/division", {
        method: 'GET'
    });
    console.log("response is :");
    console.log(response);
    console.log(response.success);
    const responseData = await response.json();
    const messageElement = document.getElementById('divisionResultMsg');
    if (responseData.success) {
        messageElement.textContent = "The result is:";
        const resultContainer = document.createElement('div');
        if (responseData.result.length === 0) {
            const resultRow = document.createElement('div');
            resultRow.textContent = "No Result Found";
            resultContainer.appendChild(resultRow);
        } else {
            // Create a table to put the results with headers
            const resultTable = document.createElement('table');
            resultTable.setAttribute("border", "1");
            const headerRow = document.createElement('tr');
            const debutYearHeader = document.createElement('th');
            debutYearHeader.textContent = 'debut year';
            // const minFansHeader = document.createElement('th');
            // minFansHeader.textContent = 'Minimum Fans';
            headerRow.appendChild(debutYearHeader);
            // headerRow.appendChild(minFansHeader);
            resultTable.appendChild(headerRow);
            responseData.result.forEach(rowData => {
                const row = document.createElement('tr');
                const debutYearCell = document.createElement('td');
                debutYearCell.textContent = rowData[0];
                // const minFansCell = document.createElement('td');
                // minFansCell.textContent = rowData[1];
                row.appendChild(debutYearCell);
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
        const errorMessage = responseData.error ? responseData.error : "Error division!";
        messageElement.textContent = errorMessage;
    }
}




async function division(event) {
    event.preventDefault();
    console.log("division start");
    const response = await fetch("/division", {
        method: 'GET'
    });
    console.log("response is :");
    console.log(response);
    console.log(response.success);
    const responseData = await response.json();
    const messageElement = document.getElementById('divisionResultMsg');

    if (responseData.success) {
        messageElement.textContent = "The result is:";

        const resultContainer = document.createElement('div');

        if (responseData.result.length === 0) {
            const resultRow = document.createElement('div');
            resultRow.textContent = "No Result Found";
            resultContainer.appendChild(resultRow);
        } else {
            // Create a table to put the results with headers
            const resultTable = document.createElement('table');
            resultTable.setAttribute("border", "1");
            const headerRow = document.createElement('tr');
            const debutYearHeader = document.createElement('th');
            debutYearHeader.textContent = 'debut year';
//            const minFansHeader = document.createElement('th');
//            minFansHeader.textContent = 'Minimum Fans';

            headerRow.appendChild(debutYearHeader);
//            headerRow.appendChild(minFansHeader);
            resultTable.appendChild(headerRow);

            responseData.result.forEach(rowData => {
                const row = document.createElement('tr');

                const debutYearCell = document.createElement('td');
                debutYearCell.textContent = rowData[0];

//                const minFansCell = document.createElement('td');
//                minFansCell.textContent = rowData[1];

                row.appendChild(debutYearCell);
//                row.appendChild(minFansCell);
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
        const errorMessage = responseData.error ? responseData.error : "Error division!";
        messageElement.textContent = errorMessage;
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    fetchTableData();
    // fetchPerformerTableData();
    fetchAllTableData();
    document.getElementById("resetAll").addEventListener("click", resetAll);
    document.getElementById("insertPerformer").addEventListener("submit", insertPerformer);
    document.getElementById("updatePerformer").addEventListener("submit", updatePerformer);
    document.getElementById("deletePerformer").addEventListener("submit", deletePerformer);
    document.getElementById("selectPerformer").addEventListener("submit", selectPerformer);
    document.getElementById('projectionPerformer').addEventListener('submit', projectPerformer);
    document.getElementById("findSongForPerformer").addEventListener("submit", joinPerformer);
    document.getElementById("aggregationGroupby").addEventListener("click", aggregationGroupby);
    document.getElementById("performerGroupByFanCount").addEventListener("submit", aggregationHaving);
    document.getElementById('nestedAggregation').addEventListener('submit', nestedAggregationPerformer);
    document.getElementById("division").addEventListener("click", division);
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
