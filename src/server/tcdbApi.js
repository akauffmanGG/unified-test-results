const express = require('express');
const router = express.Router();
const sql = require('mssql');

const config = {
    user: 'reportuser',
    password: 'testing',
    server: 'tcdb.us.int.genesyslab.com',
    database: 'TestCase'
}

const pool = new sql.ConnectionPool(config).connect();


const TestCaseIdList = new sql.Table('TestCaseIdList');
TestCaseIdList.columns.add('TestCaseID', sql.Int);

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('tcdb api root');
});

/* GET priorities for a given set of test cases */
router.get('/priorities/lookupByTestCase', (req, res) => {
    console.info('getting priorities')

    let testCaseIdParams = req.query.testCaseIds;

    let testCaseIds = testCaseIdParams.split(',');
    console.info('Getting priorities for ' + testCaseIds.length + ' testcase ids.');

    testCaseIds.forEach(testCaseId => {
        TestCaseIdList.rows.add(testCaseId);
    });

    return pool.then(pool => {

        let dbReq = pool.request();
        dbReq.input('TestCaseIds', TestCaseIdList);

        return dbReq.execute('TestCaseAdmin.spGetPrioritiesByTestCaseIds');
    }).then(result => {
        console.info('Found ' + result.recordset.length + ' priority results. ');
        res.send(result.recordset);
    }).catch(err => {
        console.error('ERROR: ' + err);
        res.send('ERROR: ' + err);
        sql.close();
    });

});

module.exports = router;
