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

router.get('/:tableName', async (req, res) => {
    const { tableName } = req.params;
    const tableContent = await appService.fetchTableFromDb(tableName);
    res.json({data: tableContent});
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

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
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


module.exports = router;