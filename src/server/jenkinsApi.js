const express = require('express');
const router = express.Router();
const axios = require('axios');


const JENKINS_BASE_URL = 'https://ci.qfun.com/';
const CONNECT_JOB = 'job/pureconnect/job/interaction_connect/';
const ICAT_JOB = 'job/webic-icat/';
const MAIN_JOB = 'job/client.test.latest_systest/';
const JSON_API = 'api/json';
const LAST_SUCCESSFUL_ROUTE = 'lastSuccessfulBuild/testReport/';


const WEBIC_ICAT_URL = JENKINS_BASE_URL + CONNECT_JOB + ICAT_JOB;
const WEBIC_ICAT_URL_API = WEBIC_ICAT_URL + JSON_API;

const MAIN_BASE_URL = WEBIC_ICAT_URL + MAIN_JOB;
const MAIN_JOB_URL_API = MAIN_BASE_URL + JSON_API;
const MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL = MAIN_BASE_URL + LAST_SUCCESSFUL_ROUTE;
const MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL_API = MAIN_BASE_URL + LAST_SUCCESSFUL_ROUTE + JSON_API;

// Ignore Jenkins self signed certificate
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function getQAJobUrl() {
    let qaRegex = new RegExp('client\.test\.([0-9]*)r([0-9])_systest');
    let qaJob;
    let currentYear = 0;
    let currentRelease = 0;
    return axios.get(WEBIC_ICAT_URL_API).then(result => {
        return result.data.jobs;
    }).then(jobList => {
        jobList.forEach((job) => {
            let result = job.name.match(qaRegex);
            if (result && result[1] >= currentYear && result[2] >= currentRelease) {
                qaJob = job;
                currentYear = result[1];
                currentRelease = result[2];
            }
        });
        return {
            qaBaseUrl: qaJob.url,
            qaJobUrl: qaJob.url + JSON_API,
            qaLastSuccessfulTestReportUrl: qaJob.url + LAST_SUCCESSFUL_ROUTE,
            qaLastSuccessfulTestReportUrlApi: qaJob.url + LAST_SUCCESSFUL_ROUTE + JSON_API
        }
    });
};

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('jenkins api root');
});

// Get build information from the main jenkins job
router.get('/main/job', (req, res, next) => {
    let url = MAIN_JOB_URL_API;
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error)
    });
});

// Get build information for a specific build number
router.get('/main/build/:number', (req, res, next) => {
    let url = MAIN_BASE_URL + req.params.number + '/' + JSON_API;
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error)
    });
});

// Get test results from latest main run
router.get('/main/test_report/latest', (req, res, next) => {
    let url = MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL_API;
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        let data = result.data;
        data.url = MAIN_LAST_SUCCESSFUL_TEST_REPORT_URL;

        res.status(200).json(data);
    }).catch(error => {
        next(error)
    });
});

// Get test results from specific main run
router.get('/main/test_report/:buildNumber', (req, res, next) => {
    let url = MAIN_BASE_URL + req.params.buildNumber + '/testReport/' + JSON_API
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get build information from the qa jenkins job
router.get('/qa/job', (req, res, next) => {
    getQAJobUrl().then(urlObj => {
        let url = urlObj.qaJobUrl;
        console.log('Getting ' + url);
        return url;
    }).then(url => {
        return axios.get(url)
    }).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get build information for a specific build number
router.get('/qa/build/:number', (req, res, next) => {
    getQAJobUrl().then(urlObj => {
        let url = urlObj.qaBaseUrl + req.params.number + '/' + JSON_API;
        console.log('Getting ' + url);
        return url;
    }).then(url => {
        return axios.get(url)
    }).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get test results from latest qa run
router.get('/qa/test_report/latest', (req, res, next) => {
    let lastSuccessfulTestReport;
    getQAJobUrl().then(urlObj => {
        let url = urlObj.qaLastSuccessfulTestReportUrlApi;
        lastSuccessfulTestReport = urlObj.qaLastSuccessfulTestReportUrl
        console.log('Getting ' + url); 
        return url;
    }).then(url => {
        return axios.get(url)
    }).then(result => {
        result.data.url = lastSuccessfulTestReport;
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get test results from specific qa run
router.get('/qa/test_report/:buildNumber', (req, res, next) => {
    getQAJobUrl().then(urlObj => {
        let url = urlObj.qaBaseUrl + req.params.buildNumber + '/testReport/' + JSON_API
        console.log('Getting ' + url);
        return url;
    }).then(url => {
        return axios.get(url)
    }).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

module.exports = router;