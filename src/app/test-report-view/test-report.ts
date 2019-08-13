import TestCaseResult from './test-case-result';
import JenkinsTestReport from '../services/jenkins/jenkins-test-report';

import * as moment from 'moment';

export class TestReport {
    displayedRows: TestCaseResult[];

    successTrend: number;
    failTrend: number;
    reportUrl: string;
    duration: number;
    timestamp:number;
    buildNumber: number;

    get displayTrend(): string {
        /*if(this.successTrend) {
            return 'Successful ' + this.successTrend + ' times';
        } else if (this.failTrend) {
            return 'Failed ' + this.failTrend + ' times';
        }*/

        return this.successTrend ? this.successTrend.toString() : this.failTrend.toString();
    }

    get displayDuration(): string {
        return moment.utc(this.duration).format('H [hr] mm [min]');
    }

    get displayTime(): string {
        return moment(this.timestamp).format('MMM Do, YYYY h:mm A')
    }
}
