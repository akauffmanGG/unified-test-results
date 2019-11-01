import TestCaseResult from './test-case-result';

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

        return this.successTrend ? this.successTrend.toString() : this.failTrend.toString();
    }

    get displayDuration(): string {
        return moment.utc(this.duration).format('H [hr] mm [min]');
    }

    get displayTime(): string {
        return moment(this.timestamp).format('MMM Do, YYYY h:mm A')
    }
}
