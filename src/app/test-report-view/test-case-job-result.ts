import JenkinsTestCase from '../jenkins/jenkins-test-case';

const CONSISTENT_FAIL_NUMBER = 3;

export class TestCaseJobResult {
    age: number;
    failedSince: number;
    status: string;
    errorMessage: string = "";
    recordingLink: string;

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

        if(obj.errorDetails) {
            this.errorMessage = this.getErrorDetailsMessage(obj.errorDetails);
        }

        if(this.status === 'REGRESSION') {
            this.status = 'FAILED';
        }
    }

    private getErrorDetailsMessage(errorDetails: string): string {
        if(!errorDetails || errorDetails.length === 0) {
            return;
        }

        let message = errorDetails.split('+++')[0];
        message = message
            .replace(/\n/g, '')
            .replace(/\s{2,}/g,'')
            .replace('ININ.Testing.Automation.Core.TraceTrueException :', '')
            .replace('ININ.Testing.Automation.ManagedICWS.NegativeICWSResponseException :', '')
            .replace(/---- OpenQA\.Selenium\.WebDriverTimeoutException : Timed out after \d* seconds/g, '')
            .replace(/(recording:\s)(http:.*mp4)/gi, (match, group1, group2):string => {
                this.recordingLink = group2;
                
                return '';
            });

        return message;
    }
}
