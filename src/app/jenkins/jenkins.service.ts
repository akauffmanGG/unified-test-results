import { Injectable } from '@angular/core';

//TODO: Convert to HttpClientModule
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { JenkinsJob } from './jenkins-job';
import { JenkinsBuild } from './jenkins-build';
import JenkinsTestReport from './jenkins-test-report';
import JenkinsJobEnum from './jenkins-job-enum';

@Injectable()
export class JenkinsService {
    private static readonly QA_BUILD_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/cic_regression/api/json';
    private static readonly QA_LAST_COMPLETED_TEST_REPORT_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/cic_regression/lastSuccessfulBuild/testReport/api/json';
    private static readonly MAIN_BUILD_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/main_regression/api/json';
    private static readonly MAIN_LAST_COMPLETED_TEST_REPORT_URL = 'http://ci.qfun.com:8080/job/pureconnect/job/interaction_connect/job/main_regression/lastSuccessfulBuild/testReport/api/json';

    constructor(private http: Http) { };

    getMainJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.MAIN);
    }

    getQaJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.QA);
    }

    getJenkinsJob(job: JenkinsJobEnum): Promise<JenkinsJob> {
        let url = '';
        if(job === JenkinsJobEnum.MAIN) {
            url = JenkinsService.MAIN_BUILD_URL;
        } else if (job == JenkinsJobEnum.QA) {
            url = JenkinsService.QA_BUILD_URL;
        } else {
            console.error('Invalid job parameter');
            return;
        }

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Latest Completed Build completed with status ' + response.status);
                return new JenkinsJob(response.json());
            }).catch(this.handleError);
    };

    getTestReport(build: JenkinsBuild): Promise<JenkinsTestReport> {
        return this.http.get(build.testReportUrl)
            .toPromise()
            .then(response => {
                console.log('Get Test Report completed with status ' + response.status);
                return new JenkinsBuild(response.json());
            }).catch(this.handleError);
    }

    getLatestTestReport(job: JenkinsJobEnum): Promise<JenkinsTestReport> {
        let url = '';
        if(job === JenkinsJobEnum.MAIN) {
            url = JenkinsService.MAIN_LAST_COMPLETED_TEST_REPORT_URL;
        } else if (job == JenkinsJobEnum.QA) {
            url = JenkinsService.QA_LAST_COMPLETED_TEST_REPORT_URL;
        } else {
            console.error('Invalid job parameter');
            return;
        }

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Last Completed Test Report completed with status ' + response.status);
                return new JenkinsTestReport(response.json());
            }).catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
