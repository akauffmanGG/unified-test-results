import JenkinsTestCase from '@service/jenkins/jenkins-test-case';

const CONSISTENT_FAIL_NUMBER = 3;

export class TestCaseJobResult {
    suite: string;
    case: string;
    age: number;
    failedSince: number;
    status: string;
    errorMessage: string = "";
    recordingLink: string;

    get displayName(): string {
        return this.suite + ' ' + this.case;
    }

    get isFailure(): boolean {
        return this.status === 'FAILED';
    }

    get isConsistentlyFailing(): boolean {
        return this.isFailure && this.age > CONSISTENT_FAIL_NUMBER;
    }

    constructor(obj: any) {
        this.suite = obj.suite;
        this.case = obj.case;
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

    // TCDB reports each step of a test individually. We need to merge those results together
    // under a single test case. If any step of the test fails, we should consider the whole test a failure.
    merge(other: TestCaseJobResult) : void {
        if(this.suite !== other.suite || this.case !== other.case) {
            throw new Error('Results cannot be merged');
        }

        if(other.isFailure) {
            this.status = 'FAILED';

            if(this.errorMessage != other.errorMessage) {
                this.errorMessage += (' ' + other.errorMessage);
            }
            
            if(other.age > this.age){
                this.age = other.age;
            }

            if(this.failedSince === 0 || other.failedSince < this.failedSince) {
                this.failedSince = other.failedSince;
            }

            //TODO: How to merge recording link?
        }
    }

    private getErrorDetailsMessage(errorDetails: string): string {
        if(!errorDetails || errorDetails.length === 0) {
            return;
        }

        let message = errorDetails.split('+++')[0];
        message = message
            .replace(/(\n|\\n)/g, ' ') //Replace new lines or escaped new lines
            .replace(/(\r|\\r)/g, ' ') //Replace line feeds or escaped line feeds
            .replace(/\s{2,}/g,' ') //Replace extra whitespace
            .replace('ININ.Testing.Automation.Core.TraceTrueException :', '') //Replace common exception types
            .replace('ININ.Testing.Automation.ManagedICWS.NegativeICWSResponseException :', '') //Replace common exception types
            .replace(/---- OpenQA\.Selenium\.WebDriverTimeoutException : Timed out after \d* seconds/g, '') //Replace common stack messages
            .replace(/(recording:\s)(http:.*mp4)?/gi, (match, group1, group2):string => { //match recording link
                this.recordingLink = group2;
                
                return '';
            });

        return message;
    }
}
