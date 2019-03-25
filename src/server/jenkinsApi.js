const express = require('express');
const router = express.Router();
const axios = require('axios');

const QA_BASE_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/connect_cic_regression';
const MAIN_BASE_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/webic-icat/job/client.test.latest_systest';
const JSON_API = '/api/json';
const LAST_SUCCESSFUL_ROUTE = '/lastSuccessfulBuild/testReport';

const QA_JOB_URL_API = QA_BASE_URL + JSON_API;
const QA_LAST_SUCCESSFUL_TEST_REPORT_URL = QA_BASE_URL + LAST_SUCCESSFUL_ROUTE;
const QA_LAST_SUCCESSFUL_TEST_REPORT_URL_API = QA_BASE_URL + LAST_SUCCESSFUL_ROUTE + JSON_API;
const MAIN_JOB_URL_API = MAIN_BASE_URL + JSON_API;
const MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL = MAIN_BASE_URL + LAST_SUCCESSFUL_ROUTE;
const MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL_API = MAIN_BASE_URL + LAST_SUCCESSFUL_ROUTE + JSON_API;

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('jenkins api root');
});

// Get build information from the main jenkins job
router.get('/main/job', (req, res, next) => {
  let url = MAIN_JOB_URL_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error)
    });
});

// Get build information for a specific build number
router.get('/main/build/:number', (req, res, next) => {
  let url = MAIN_BASE_URL + '/' + req.params.number + JSON_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error)
    });
});

// Get test results from latest main run
router.get('/main/test_report/latest', (req, res, next) => {
  let url = MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      let data = result.data;
      data.url = MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL;

      res.status(200).json(data);
    })
    .catch(error => {
      next(error)
    });
});

// Get test results from specific main run
router.get('/main/test_report/:buildNumber', (req, res, next) => {
  let url = MAIN_BASE_URL + '/' + req.params.buildNumber + '/testReport' + JSON_API
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
     next(error);
    });
});

// Get build information from the qa jenkins job
router.get('/qa/job', (req, res, next) => {
  let url = QA_JOB_URL_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error);
    });
});

// Get build information for a specific build number
router.get('/qa/build/:number', (req, res, next) => {
  let url = QA_BASE_URL + '/' + req.params.number + JSON_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error);
    });
});

// Get test results from latest qa run
router.get('/qa/test_report/latest', (req, res, next) => {
  let url = QA_LAST_SUCCESSFUL_TEST_REPORT_URL_API;
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      result.data.url = QA_LAST_SUCCESSFUL_TEST_REPORT_URL;

      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error)
    });
});

// Get test results from specific qa run
router.get('/qa/test_report/:buildNumber', (req, res, next) => {
  let url = QA_BASE_URL + '/' + req.params.buildNumber + '/testReport' + JSON_API
  console.log('Getting ' + url);
  axios.get(url)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      next(error)
    });
});

module.exports = router;