const express = require('express');
const router = express.Router();
const axios = require('axios');

//Auth token for Andy's account base64 encoded from username:password
let credentials = process.env.JIRA_USER + ':' + process.env.JIRA_PASSWORD;
const JIRA_AUTH = 'Basic ' + new Buffer(credentials).toString('base64');
console.info(JIRA_AUTH);

//Plain text query: https://devjira.inin.com/rest/api/2/search?jql=project = Web AND component = "E2E Tests" and issueType = Bug AND status in (Accepted, "Waiting for Review", "Integration Testing") and "Test Case Id" is not EMPTY&fields=id,key,summary,customfield_10073,assignee,status
const QUERY_URL = 'https://devjira.inin.com/rest/api/2/search?jql=project%20=%20Web%20AND%20component%20=%20%22E2E%20Tests%22%20and%20issueType%20=%20Bug%20AND%20status%20in%20(Accepted,%20%22Waiting%20for%20Review%22,%20%22Integration%20Testing%22)%20and%20%22Test%20Case%20Id%22%20is%20not%20EMPTY&fields=id,key,summary,customfield_10073,assignee,status';
const ISSUE_URL = 'https://devjira.inin.com/rest/api/2/issue';

let config = {
    headers: { Authorization: JIRA_AUTH }
};

/* GET api listing. */
router.get('/', (req, res) => {
    res.send('jira api root');
});

// Get open issues from the query
router.get('/issues', (req, res, next) => {
    console.info('Getting all issues');
    axios.get(QUERY_URL, config)
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(error => {
            console.error('Failed getting all jira issues.');
            next(error);
        });
});

router.get('/issue/:issueKey', (req, res, next) => {
    let issueKey = req.params.issueKey;
    console.info('Getting issue: ', issueKey);

    axios.get(ISSUE_URL + '/' + issueKey, config)
        .then(result => {
            console.log(issueKey, ' retrieved successfully');
            res.status(200).json(result.data);
        })
        .catch(error => {
            console.log('Failed to retrieve issue: ', issueKey);
            next(error);
        });
});

// Create a new issue
router.post('/issue', (req, res, next) => {
    console.info('Creating new issue');

    let description = req.query.description;
    let teamLabel = req.query.teamLabel;
    let testCase = req.query.testCase;

    let newIssueKey = '';
    axios.post(ISSUE_URL, createIssueObj(description, teamLabel), config)
        .then(result => {
            newIssueKey = result.data.key;
            console.log('Issue ' + newIssueKey + ' created successfully');
            return axios.put(ISSUE_URL + '/' + newIssueKey, createEditObj(testCase), config);
        }).then(result => {
            console.log('Issue ' + newIssueKey + ' edited successfully');
            res.status(200).json({ issueKey: newIssueKey })
        }).catch(error => {
            if(error.response.status === 403) {
                console.log('Authentication failed creating Jira issue.');
                //NOTE: If authentication fails too many times, Jira may start responding with 'X-Authentication-Denied-Reason: CAPTCHA_CHALLENGE;'
                // If that happens you will need to logout of a jira, log back in and answer the CAPTCHA before request will start being allowed.
            } else {
                console.log('Creating issue failed with response status: ', error.response.status);
            }
            
            next(error);
        });
});

function createEditObj(testCase) {
    return {
        fields: {
            customfield_10073: testCase //Test Case Id
        }
    }
}

function createIssueObj(description, teamLabel) {

    return {
        fields: {
            project:
                {
                    key: "WEB"
                },
            description,
            issuetype: {
                name: "Bug"
            },
            summary: description,
            versions: [{
                name: "main"
            }],
            fixVersions: [{
                name: "main"
            }],
            components: [{
                name: "E2E Tests"
            }],
            priority: {
                name: "P3"
            },
            //Found in Branch
            customfield_11990: {
                value: "Systest"
            },
            //Development labels
            customfield_10350: [teamLabel]
        }
    }
}

module.exports = router;