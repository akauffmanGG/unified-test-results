import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { JenkinsJob } from './jenkins-job';
import { JenkinsBuild } from './jenkins-build';
import JenkinsTestReport from './jenkins-test-report';
import JenkinsJobEnum from './jenkins-job-enum';

@Injectable()
export class JenkinsService {
    constructor(private http: HttpClient) { };

    getMainJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.MAIN);
    }

    getQaJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.QA);
    }

    getJenkinsJob(job: JenkinsJobEnum): Promise<JenkinsJob> {
        let url = '';
        if(job === JenkinsJobEnum.MAIN) {
            url = 'api/jenkins/main/job';
        } else if (job == JenkinsJobEnum.QA) {
            url = 'api/jenkins/qa/job';
        } else {
            console.error('Invalid job parameter');
            return;
        }

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Latest Completed Build completed successfully');
                return new JenkinsJob(response);
            }).catch(this.handleError);
    };

    getLatestTestReport(job: JenkinsJobEnum): Promise<JenkinsTestReport> {
        let url = '';
        if(job === JenkinsJobEnum.MAIN) {
            url = '/api/jenkins/main/test_report/latest';
        } else if (job == JenkinsJobEnum.QA) {
            url = '/api/jenkins/qa/test_report/latest';
        } else {
            console.error('Invalid job parameter');
        }

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Last Completed Test Report completed successfully');
                return new JenkinsTestReport(response);
            }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
