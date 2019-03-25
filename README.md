# Unified Test Results

A combined view of QA and Main test results for Interaction Connect.

Allows you to:
<ul>
<li>Compare pass/fail results of QA and Main tests side by side</li>
<li>Filter results by a variety of parameters including test name, status, and error message.</li>
<li>See the history of the last 10 runs of a test along with the failure reason for any particular failure.</li>
<li>Sort by any field including history fields which will order by flappiness (alternating between pass and fail).</li>
<li>Link to test recording in the returned error message.</li>
<li>Create SCRs with appropriate information for any test that has been failing consistently</li>
</ul>

## Environment Setup

`npm install package-lock.json` to install the correct dependencies for the application.

Create `JIRA_USER` and `JIRA_PASSWORD` environment variables with appropriate credentials for viewing and creating Jira SCRs.

Create `PORT` environment variable to change the server port. Otherwise it will default to 3001.

## Running Locally

This application relies webpack to build the application and node to serve it.

### Starting node server

From unified-test-results directory run `node src/server/server.js`

### Build the application

From unified-test-results directory run `npm run build` to build the application and watch for changes.

