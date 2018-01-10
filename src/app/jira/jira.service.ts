import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { JiraQuery } from './jira-query';
import { JiraIssue } from './jira-issue';

import TestCaseResult from '../test-report-view/test-case-result';

@Injectable()
export class JiraService {
    constructor(private http: HttpClient) { }

    getFailureIssues(): Promise<JiraQuery> {
        return this.http.get<JiraQuery>('api/jira/issues').toPromise()
            .then(response => {
                return new JiraQuery(response);
            }, this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    postNewIssue(testCaseResult: TestCaseResult): Promise<JiraIssue> { 
        let params = new HttpParams().set('description', this.createDescription(testCaseResult))
            .set('testCase', testCaseResult.case)
            .set('teamLabel', testCaseResult.team.developmentLabel);

        return this.http.post('api/jira/issue', {}, {
            params
        }).toPromise().then((response:any) => {
            let newIssueKey = response.issueKey;
            console.log('Issue ' + newIssueKey + ' created successfully');

            return this.http.get('/api/jira/issue/' + newIssueKey).toPromise()
        }).then((response: any) => {
            return new JiraIssue(response);
        });//TODO: Error handling
    }

    private createDescription(testCaseResult: TestCaseResult): string {
        let description: string = `${testCaseResult.suite} ${testCaseResult.case} fails at `;

        if(testCaseResult.qaResult.isConsistentlyFailing && testCaseResult.mainResult.isConsistentlyFailing) {
            return description + 'Main and QA'
        } else if(testCaseResult.qaResult.isConsistentlyFailing) {
            return description + 'QA';
        } else if(testCaseResult.mainResult.isConsistentlyFailing) {
            return description + 'Main'
        }
    }

}
