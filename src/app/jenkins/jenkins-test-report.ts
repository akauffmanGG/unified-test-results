import JenkinsTestCase from './jenkins-test-case';
import * as _ from 'lodash';

export default class JenkinsTestReport {
    failCount: number;
    passCount: number;
    skipCount: number;

    testCases: JenkinsTestCase[];

    constructor(obj: any) {
        this.failCount = obj.failCount;
        this.passCount = obj.passCount;
        this.skipCount = obj.skipCount;

        let suites : any[] = obj.suites;
        this.testCases = _.map(suites, suite => new JenkinsTestCase( suite.cases[0] ) );
    }
}
