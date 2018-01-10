const express = require('express');
const router = express.Router();
const axios = require('axios');

//Auth token for Andy's account
const ANDY_AUTH = 'Basic QW5keS5LYXVmZm1hbjpTY2hsZWZ0eTE=';

const QUERY_URL = 'https://devjira.inin.com/rest/api/2/search?jql=%22Development%20Labels%22%20in%20(cart_issue)%20and%20%22Development%20Labels%22%20in%20(consistent_failure)%20and%20status%20!=%20resolved&fields=id,key,summary,customfield_10073';
const ISSUE_URL = 'https://devjira.inin.com/rest/api/2/issue';

let config = {
    headers: {Authorization: ANDY_AUTH}
};

/* GET api listing. */
router.get('/', (req, res) => {
  res.send('jira api root');
});

// Get open issues from the query
router.get('/issues', (req, res) => {
  axios.get(QUERY_URL)
    .then(result => {
      res.status(200).json(result.data);
    })
    .catch(error => {
      res.status(500).send(error)
    });
});

router.get('/issue/:issueKey', (req, res) => {
    let issueKey = req.params.issueKey;

    axios.get(ISSUE_URL + '/' + issueKey, config)
      .then(result => {
        res.status(200).json(result.data);
      })
      .catch(error => {
        res.status(500).send(error)
      });
  });

// Create a new issue
router.post('/issue', (req, res) => {
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
            res.status(200).json({issueKey: newIssueKey})
        }).catch(error => {
            res.status(500).send(error)
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
                key: "WICCLIENT"
            },
            description,
            issuetype: {
                name: "Bug"
            },
            summary: description,
            versions: [{
                name: "main" //TODO: replace with correct version when qa failure
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
            customfield_10350: ["cart_issue", "consistent_failure", teamLabel]
        }
    }
}

module.exports = router;