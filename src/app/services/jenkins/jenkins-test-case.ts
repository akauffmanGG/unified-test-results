export default class JenkinsTestCase {
    private static readonly TEST_CASE_REGEX = new RegExp('TC\\d{5}', 'i');
    private static readonly TEST_SUITE_REGEX = new RegExp('TS\\d{4}', 'i');

    age: number;
    className: string;
    failedSince: number;
    name: string;
    status: string;
    suite: string;
    case: string;
    errorDetails: string;
    errorStackTrace: string;

    constructor(obj: any) {
        this.age = obj.age;
        this.className = obj.className;
        this.failedSince = obj.failedSince;
        this.name = obj.name;
        this.status = obj.status;
        this.errorDetails = obj.errorDetails;
        this.errorStackTrace = obj.errorStackTrace;

        let anyName = this.className + this.name;
        let match = JenkinsTestCase.TEST_CASE_REGEX.exec(anyName);
        if(match) {
            this.case = match[0];
        }

        match = JenkinsTestCase.TEST_SUITE_REGEX.exec(anyName);
        if(match) {
            this.suite = match[0];
        }

    }
}
