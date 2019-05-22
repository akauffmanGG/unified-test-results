import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { JenkinsJob } from './jenkins-job';
import { JenkinsBuild } from './jenkins-build';
import JenkinsTestReport from './jenkins-test-report';
import JenkinsJobEnum from './jenkins-job-enum';
import _ from 'lodash';

@Injectable()
export class JenkinsService {
    constructor(private http: HttpClient) { };

    getMainJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.MAIN);
    }

    getQaJob(): Promise<JenkinsJob> {
        return this.getJenkinsJob(JenkinsJobEnum.QA);
    }

    getJenkinsJob(jobType: JenkinsJobEnum): Promise<JenkinsJob> {
        let url = this.getApiPrefix(jobType) + '/job';

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Jenkins Job completed successfully');
                return new JenkinsJob(response);
            }).catch(this.handleError);
    };

    getLatestTestReport(jobType: JenkinsJobEnum): Promise<JenkinsTestReport> {
        let url = this.getApiPrefix(jobType) + '/test_report/latest';

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Last Completed Test Report completed successfully');
                return new JenkinsTestReport(response);
            }).catch(this.handleError);
    }

    // Get test reports for the defined number of prior runs
    getHistoricalReports(jobType: JenkinsJobEnum, resultsAmount: number = 10): Promise<any[]> {
        return this.getJenkinsJob(jobType)
            .then((jenkinsJob: JenkinsJob) => {
                return this.getSuccessfulBuilds(jenkinsJob, jobType);

            }).then((builds: JenkinsBuild[]) => {
                let recentBuilds = _.takeRight(_.sortBy(builds, 'number'), resultsAmount);
                return Promise.all(_.map(recentBuilds, build => {
                    let url = this.getApiPrefix(jobType) + '/test_report/' + build.number;
                    return this.http.get(url)
                        .toPromise()
                        .then(response => {
                            console.log('Get test report for build ' + build.number + ' successfully');
                            
                            let obj: {
                                build: number,
                                report: JenkinsTestReport
                            } = {
                                build: build.number,
                                report: new JenkinsTestReport(response)
                            };
                            return obj;
                        }).catch(this.handleError);
                })).then(results => {
                    //sort by build number in ascending order
                   return _.sortBy(results, 'build');
                });
            });
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private getApiPrefix(jobType: JenkinsJobEnum): String {
        if (jobType === JenkinsJobEnum.MAIN) {
            return '/api/jenkins/main';
        } else if (jobType == JenkinsJobEnum.QA) {
            return '/api/jenkins/qa';
        } else {
            console.error('Invalid job parameter');
        }
    }

    private getSuccessfulBuilds(job: JenkinsJob, jobType: JenkinsJobEnum): Promise<JenkinsBuild[]> {
        console.log('Getting all successful ' + jobType.toString() + ' builds');
        let url = this.getApiPrefix(jobType) + '/build/';
        let successfulBuilds: JenkinsBuild[] = [];
        return Promise.all(_.map(job.builds, build => {
            return this.http.get(url + build.number)
                .toPromise()
                .then((response: any) => {
                    if (response.result === 'SUCCESS') {
                        successfulBuilds.push(build);
                    }
                }).catch(this.handleError);
        })
        ).then(() => {
            console.log('Number of successful ' + jobType.toString() + ' builds: ' + successfulBuilds.length);
            return successfulBuilds;
        });

    }

}
