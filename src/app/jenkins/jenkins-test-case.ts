export default class JenkinsTestCase {
    age: number;
    className: string;
    failedSince: number;
    name: string;
    status: string;
    suite: string;
    case: string;
    errorStackTrace: string;

    constructor(obj: any) {
        this.age = obj.age;
        this.className = obj.className;
        this.failedSince = obj.failedSince;
        this.name = obj.name;
        this.status = obj.status;
        this.errorStackTrace = obj.errorStackTrace;

        let classNameParts: string[] = this.className.split('.');
        //The suite and test case are always the last two parts of the class name.
        if(classNameParts.length >= 2) {
            this.suite = classNameParts[classNameParts.length -2];
            this.case = classNameParts[classNameParts.length -1];
        }
    }
}
