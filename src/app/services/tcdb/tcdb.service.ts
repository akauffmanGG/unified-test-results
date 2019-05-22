import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import _ from 'lodash';

@Injectable()
export class TcdbService {
    constructor(private http: HttpClient) { }

    /**
     * 
     * @param testCases array of test case ids. Should not contain 'TC' prefix.
     * @return Array of { 'TestCaseId', 'Priority' }
     */
    getTestCasePriorities( testCases: String[]) : Promise<[{ TestCaseId : String, Priority : String }]> {
        let params = new HttpParams().set('testCaseIds', testCases.join(","));

        return this.http.get('api/tcdb/priorities/lookupByTestCase', { params })
        .toPromise()
        .then(response => {
            let testCasePriorities: [{ TestCaseId : String, Priority : String }] = response as [{ TestCaseId : String, Priority : String }];
            console.log('Get tcdb priorities completed successfully. Found ' + testCasePriorities.length);
            return testCasePriorities;
        }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}