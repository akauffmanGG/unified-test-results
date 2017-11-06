export class JenkinsBuild {
    private _class: string;
    number: number;
    url: string;

    get testReportUrl(): string {
        return this.url + 'testReport/api/json';
    }

    constructor (obj: any) {
        this._class = obj._class
        this.number = obj.number;
        this.url = obj.url;
    }
}
