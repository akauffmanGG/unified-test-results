import JenkinsTestCase from '../jenkins/jenkins-test-case';

const CONSISTENT_FAIL_NUMBER = 3;

export class TestCaseJobResult {
    age: number;
    failedSince: number;
    status: string;
    stackTrace: string;
    stackTraceMessage: string;

    get isFailure(): boolean {
        return this.status === 'FAILED';
    }

    get isConsistentlyFailing(): boolean {
        return this.isFailure && this.age > CONSISTENT_FAIL_NUMBER;
    }

    constructor(obj: any) {
        this.age = obj.age;
        this.failedSince = obj.failedSince;
        this.status = obj.status;
        this.stackTrace = obj.errorStackTrace;

        if(this.stackTrace) {
            this.stackTraceMessage = this.getStackTraceMessage(obj.errorStackTrace);
        }

        if(this.status === 'REGRESSION') {
            this.status = 'FAILED';
        }
    }

    private getStackTraceMessage(stackTrace: string): string {
        if(!stackTrace || stackTrace.length === 0) {
            return;
        }

        let message = stackTrace.split('+++')[0];
        message = message
            .replace(/\n/g, '')
            .replace(/\s{2,}/g,'')
            .replace('MESSAGE:ININ.Testing.Automation.Core.TraceTrueException :', '')
            .replace('MESSAGE:ININ.Testing.Automation.ManagedICWS.NegativeICWSResponseException :', '');

        return message;
    }
}
