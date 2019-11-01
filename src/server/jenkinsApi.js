const express = require('express');
const router = express.Router();
const axios = require('axios');
const _ = require('lodash');

const JSON_API = 'api/json';
const LAST_SUCCESSFUL_ROUTE = 'lastSuccessfulBuild/testReport/';

const WEBIC_ICAT_URL = 'https://ci.qfun.com/job/pureconnect/job/interaction_connect/job/webic-icat/';
const WEBIC_ICAT_URL_API = WEBIC_ICAT_URL + JSON_API;

const ICWS_ICAT_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/icws/job/icws-icat/';
const ICWS_ICAT_URL_API = ICWS_ICAT_URL + JSON_API;

const ICAT_NODE_URL_API = 'https://ci.qfun.com/computer/api/json';

// Ignore Jenkins self signed certificate
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

function getJobUrl(name, type) {
    if(!type) {
        type = '';
    }

    return (type.toLowerCase() === 'icws' ? ICWS_ICAT_URL : WEBIC_ICAT_URL) + 'job/' + name + '/';
}

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('jenkins api root');
});

// Get list of icat jobs
router.get('/icat/jobs', (req, res, next) => {
    console.log('Getting list of icat jobs');
    Promise.all([
        axios.get(WEBIC_ICAT_URL_API),
        axios.get(ICWS_ICAT_URL_API)
    ]).then(results => {
        res.status(200).json(_.concat(results[0].data.jobs, results[1].data.jobs));
    }).catch(error => {
        next(error);
    });
});

// Get job information from the icat jenkins job
router.get('/icat/job/:jobName', (req, res, next) => {
    let type = req.query.type;

    let url = getJobUrl(req.params.jobName, type) + JSON_API;
    console.log('Getting ' + url);
    return axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get build information for a specific build number
router.get('/icat/build/:jobName/:number', (req, res, next) => {
    let type = req.query.type;

    let url = getJobUrl(req.params.jobName, type) + req.params.number + '/' + JSON_API;
    console.log('Getting ' + url);
    return axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get test results from latest run
router.get('/icat/test_report/:jobName/latest', (req, res, next) => {
    let type = req.query.type;

    let url = getJobUrl(req.params.jobName, type) + LAST_SUCCESSFUL_ROUTE + JSON_API;
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        let data = result.data;
        data.url = getJobUrl(req.params.jobName, type) + LAST_SUCCESSFUL_ROUTE;

        res.status(200).json(data);
    }).catch(error => {
        next(error)
    });
});

// Get test results from specific icat run
router.get('/icat/test_report/:jobName/:buildNumber', (req, res, next) => {
    let type = req.query.type;

    let url = getJobUrl(req.params.jobName, type) + req.params.buildNumber + '/testReport/' + JSON_API
    console.log('Getting ' + url);
    axios.get(url).then(result => {
        res.status(200).json(result.data);
    }).catch(error => {
        next(error);
    });
});

// Get all icat nodes
router.get('/icat/nodes', (req, res, next) => {
    console.log('Getting list of icat nodes');
    axios.get(ICAT_NODE_URL_API).then(result => {
        console.log("Found " + result.data.computer.length + " nodes.")
        let icatNodes = _.filter(result.data.computer, (node) => {
            return node.displayName.startsWith('qf-icat');
        });

        console.log("Found " + icatNodes.length + " icat nodes.");
        res.status(200).json(icatNodes);
    }).catch(error => {
        next(error);
    });
});

module.exports = router;