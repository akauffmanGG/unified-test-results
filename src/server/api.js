const express = require('express');
const router = express.Router();

const jenkinsApi = require('./jenkinsApi');
const jiraApi = require('./jiraApi');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api root');
});

router.use('/jenkins', jenkinsApi);

router.use('/jira', jiraApi);

module.exports = router;