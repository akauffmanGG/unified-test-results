import TestCaseResult from './test-case-result';

export class TestReport {
    testCaseResults: TestCaseResult[];

    qaSuccessTrend: number;
    qaFailTrend: number;
    qaReportUrl: string;
    mainSuccessTrend: number;
    mainFailTrend: number;
    mainReportUrl: string;
}
