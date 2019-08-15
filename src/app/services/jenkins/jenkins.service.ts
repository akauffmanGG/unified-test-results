import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { JenkinsJob } from './jenkins-job';
import { JenkinsBuild } from './jenkins-build';
import JenkinsNode from './jenkins-node';
import JenkinsTestReport from './jenkins-test-report';
import JenkinsJobEnum from './jenkins-job-enum';
import _ from 'lodash';

@Injectable()
export class JenkinsService {
    constructor(private http: HttpClient) { };

    getIcatNodes(): Promise<JenkinsNode[]> {
        let url = '/api/jenkins/icat/nodes';

        return this.http.get(url)
            .toPromise()
            .then((response:any) => {
                console.log('Get Icat Nodes completed successfully');
                let nodes = _.map(response, (node) => new JenkinsNode(node));

                return nodes;
            }).catch(this.handleError);
    }

    getIcatJobs(): Promise<String[]> {
        let url = '/api/jenkins/icat/jobs';

        return this.http.get(url)
            .toPromise()
            .then((response:any) => {
                console.log('Get Icat Jobs completed successfully');
                let jobs = _.map(response, 'name');

                return jobs;
            }).catch(this.handleError);

    }

    getJenkinsJob(job: string): Promise<JenkinsJob> {
        let url = '/api/jenkins/icat/job/' + job + '/'

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Jenkins Job completed successfully');
                return new JenkinsJob(response);
            }).catch(this.handleError);
    };

    getJenkinsBuild(job: string, buildNumber: number): Promise<JenkinsBuild> {
        let url = '/api/jenkins/icat/build/' + job + '/' + buildNumber;

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Jenkins Build completed successfully');
                return new JenkinsBuild(response);
            }).catch(this.handleError);
    };

    getLatestTestReport(job: string): Promise<JenkinsTestReport> {
        let url = '/api/jenkins/icat/test_report/' + job + '/latest'

        return this.http.get(url)
            .toPromise()
            .then(response => {
                console.log('Get Last Completed Test Report completed successfully');
                return new JenkinsTestReport(response);
            }).catch(this.handleError);
    }

    // Get test reports for the defined number of prior runs
    getHistoricalReports(job: string, resultsAmount: number = 10): Promise<any[]> {
        return this.getJenkinsJob(job)
            .then((jenkinsJob: JenkinsJob) => {
                return this.getSuccessfulBuilds(jenkinsJob, job);

            }).then((builds: JenkinsBuild[]) => {
                let recentBuilds = _.takeRight(_.sortBy(builds, 'number'), resultsAmount);
                return Promise.all(_.map(recentBuilds, build => {
                    let url = '/api/jenkins/icat/test_report/' + job + '/' + build.number;
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
            return '/api/jenkins/icat/job/client.test.latest_systest/';
        } else if (jobType == JenkinsJobEnum.QA) {
            return '/api/jenkins/icat/job/client.test.2019r3_systest/';
        } else {
            console.error('Invalid job parameter');
        }
    }

    private getSuccessfulBuilds(job: JenkinsJob, jobName: string): Promise<JenkinsBuild[]> {
        console.log('Getting all successful builds');
        let url = '/api/jenkins/icat/build/' + jobName + '/'
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
            console.log('Number of successful builds: ' + successfulBuilds.length);
            return successfulBuilds;
        });

    }

}
