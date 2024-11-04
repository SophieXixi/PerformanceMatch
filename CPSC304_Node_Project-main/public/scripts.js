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

// Fetches data from the performer table and displays it.
async function fetchAndDisplayPerformers() {
    const tableElement = document.getElementById('performer');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/performer', {
        method: 'GET'
    });

    const responseData = await response.json();
    const performerContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    performerContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
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
async function resetPerformer() {
    const response = await fetch("/initiate-performer", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetPerformerResultMsg');
        messageElement.textContent = "performer table initiated successfully!";
        fetchPerformerTableData();
    } else {
        alert("Error initiating performer table!");
    }
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
        fetchPerformerTableDataData();
    } else {
        // TODO: handle invalid insert (e.g., group does not exist)
        messageElement.textContent = "Error inserting data!";
    }
}


// Selects from performer table based on conditions.
async function selectPerformer(event) {
    event.preventDefault();

    const response = await fetch('/select-performer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
//            id: idValue,
//            name: nameValue,
//            debutYear: debutYearValue,
//            numOfFans: numOfFansValue,
//            groupId: groupIdValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('selectPerformerResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data selected successfully!";
        fetchTableData();
    } else {
        // TODO: handle invalid selection
        messageElement.textContent = "Error selecting data!";
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

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    checkDbConnection();
    fetchTableData();
    fetchPerformerTableData();
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("resetPerformer").addEventListener("click", resetPerformer);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("insertPerformer").addEventListener("submit", insertPerformer);
    document.getElementById("selectPerformer").addEventListener("submit", selectPerformer);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

// General function to refresh the displayed table data.
// You can invoke this after any table-modifying operation to keep consistency.
function fetchPerformerTableData() {
    fetchAndDisplayPerformers();
}