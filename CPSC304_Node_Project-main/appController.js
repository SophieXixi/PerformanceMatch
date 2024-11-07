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


router.get('/aggregation-groupby', async(req, res) => {
    console.log("Received aggregation-groupby"); 
    const aggregationResult = await appService.aggregationGroupby();
    console.log(aggregationResult);

    if (aggregationResult && aggregationResult.error) {
        res.status(500).json({ success: false, error: aggregationResult.error.message });
    } else {
        
        res.json({ success: true, result: aggregationResult });
    }

})

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