const express = require('express');
const router = express.Router();

const jenkinsApi = require('./jenkinsApi');
const jiraApi = require('./jiraApi');
const tcdbApi = require('./tcdbApi');

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api root');
});

router.use('/jenkins', jenkinsApi);

router.use('/jira', jiraApi);

router.use('/tcdb', tcdbApi);

module.exports = router;