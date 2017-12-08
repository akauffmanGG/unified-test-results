import TestCaseResult from './test-case-result';

export class TestReport {
    testCaseResults: TestCaseResult[];

    qaSuccessTrend: number;
    qaFailTrend: number;
    mainSuccessTrend: number;
    mainFailTrend: number;
}
