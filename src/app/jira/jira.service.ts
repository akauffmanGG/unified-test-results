import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JiraQuery } from './jira-query';
import { JiraIssue } from './jira-issue';

@Injectable()
export class JiraService {

    private static readonly ANDY_AUTH: string = 'Basic QW5keS5LYXVmZm1hbjpTY2hsZWZ0eTE=';

    private static readonly QUERY_URL: string = 'https://devjira.inin.com/rest/api/2/search?jql=%22Development%20Labels%22%20in%20(cart_issue)%20and%20%22Development%20Labels%22%20in%20(consistent_failure)%20and%20status%20!=%20resolved&fields=id,key,summary,customfield_10073';
    private static readonly ISSUE_URL: string = 'https://devjira.inin.com/rest/api/2/issue';

    constructor(private http: HttpClient) { }

    getFailureIssues(): Promise<JiraQuery> {
        return this.http.get<JiraQuery>(JiraService.QUERY_URL).toPromise()
            .then(response => {
                return new JiraQuery(response);
            }, this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    postNewIssue(testSuite: string, testCase: string, qaFails: boolean, mainFails: boolean): Promise<JiraIssue> {

        let editObj = {
            fields: {
                customfield_10073: testCase //Test Case Id
            }
        }

        let authHeader = {
            headers: new HttpHeaders().set('Authorization', JiraService.ANDY_AUTH),
        };

        let newIssueKey;
        return this.http.post(JiraService.ISSUE_URL, this.createIssueObj(testSuite, testCase, qaFails, mainFails), authHeader).toPromise()
            .then((response: any) => {
                console.log('Issue ' + response.key + ' created successfully');
                newIssueKey = response.key;
                return;
            }).then(() => {
                return this.http.put(JiraService.ISSUE_URL + '/' + newIssueKey, editObj, authHeader).toPromise();
            }).then((response: any) => {
                console.log('Issue ' + newIssueKey + ' edited successfully');
                return this.http.get(JiraService.ISSUE_URL + '/' + newIssueKey, authHeader).toPromise();
            }).then((response: any) => {
                return new JiraIssue(response);
            });//TODO: Error handling

    }

    private createIssueObj(testSuite: string, testCase: string, qaFails: boolean, mainFails: boolean): any {
        let description: string = `${testSuite} ${testCase} fails at `;

        if(qaFails && mainFails) {
            description += 'Main and QA'
        } else if(qaFails) {
            description += 'QA';
        } else if(mainFails) {
            description += 'Main'
        }

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
                customfield_10350: ["cart_issue", "consistent_failure"]
            }
        }
    }
}
