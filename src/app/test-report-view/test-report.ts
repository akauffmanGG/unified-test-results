import TestCaseResult from './test-case-result';

export class TestReport {
    displayedRows: TestCaseResult[];

    qaSuccessTrend: number;
    qaFailTrend: number;
    qaReportUrl: string;
    mainSuccessTrend: number;
    mainFailTrend: number;
    mainReportUrl: string;
}
