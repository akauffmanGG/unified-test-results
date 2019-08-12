import TestCaseResult from './test-case-result';

export class TestReport {
    displayedRows: TestCaseResult[];

    successTrend: number;
    failTrend: number;
    reportUrl: string;
}
