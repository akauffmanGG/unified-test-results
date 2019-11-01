import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { JenkinsJob } from './jenkins-job';
import { JenkinsBuild } from './jenkins-build';
import JenkinsNode from './jenkins-node';
import JenkinsTestReport from './jenkins-test-report';
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

    getIcatJobs(): Promise<JenkinsJob[]> {
        let url = '/api/jenkins/icat/jobs';

        return this.http.get(url)
            .toPromise()
            .then((response:any) => {
                console.log('Get Icat Jobs completed successfully');
                let jobs = _.map(response, (job) => new JenkinsJob(job) );

                return jobs;
            }).catch(this.handleError);

    }

    setJenkinsJobBuildInfo(job: JenkinsJob): Promise<any> {
        let url = '/api/jenkins/icat/job/' + job.name + '/'

        let params = this.typeParams(job);

        return this.http.get(url , { params })
            .toPromise()
            .then(response => {
                console.log('Get Jenkins Job completed successfully');
                return job.setBuildInfo(response);
            }).catch(this.handleError);
    };

    getJenkinsBuild(job: JenkinsJob, buildNumber: number): Promise<JenkinsBuild> {
        let url = '/api/jenkins/icat/build/' + job.name + '/' + buildNumber;

        let params = this.typeParams(job);

        return this.http.get(url, { params })
            .toPromise()
            .then(response => {
                console.log('Get Jenkins Build completed successfully');
                return new JenkinsBuild(response);
            }).catch(this.handleError);
    };

    getLatestTestReport(job: JenkinsJob): Promise<JenkinsTestReport> {
        let url = '/api/jenkins/icat/test_report/' + job.name + '/latest'

        let params = this.typeParams(job);

        return this.http.get(url, { params })
            .toPromise()
            .then(response => {
                console.log('Get Last Completed Test Report completed successfully');
                return new JenkinsTestReport(response);
            }).catch(this.handleError);
    }

    // Get test reports for the defined number of prior runs
    getHistoricalReports(job: JenkinsJob, resultsAmount: number = 10): Promise<any[]> {
        return this.setJenkinsJobBuildInfo(job)
            .then(() => this.getSuccessfulBuilds(job))
            .then((builds: JenkinsBuild[]) => {
                let recentBuilds = _.takeRight(_.sortBy(builds, 'number'), resultsAmount);
                return Promise.all(_.map(recentBuilds, build => {
                    let url = '/api/jenkins/icat/test_report/' + job.name + '/' + build.number;

                    let params = this.typeParams(job);

                    return this.http.get(url, { params })
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

    private getSuccessfulBuilds(job: JenkinsJob): Promise<JenkinsBuild[]> {
        console.log('Getting all successful builds');
        let url = '/api/jenkins/icat/build/' + job.name + '/'
        let params = this.typeParams(job);
        let successfulBuilds: JenkinsBuild[] = [];
        return Promise.all(_.map(job.builds, build => {
            return this.http.get(url + build.number, { params })
                .toPromise()
                .then((response: any) => {
                    if (response.result === 'SUCCESS' || response.result === 'UNSTABLE') {
                        successfulBuilds.push(build);
                    }
                }).catch(this.handleError);
        })
        ).then(() => {
            console.log('Number of successful builds: ' + successfulBuilds.length);
            return successfulBuilds;
        });

    }

    private typeParams(job: JenkinsJob): HttpParams {
        return new HttpParams().set('type', job.type.toLowerCase());
    }

}
