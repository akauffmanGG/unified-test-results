export class JenkinsBuild {
    private _class: string;
    number: number;
    url: string;
    timestamp: number;
    duration: number;

    get testReportUrl(): string {
        return this.url + 'testReport/api/json';
    }

    constructor (obj: any) {
        this._class = obj._class
        this.number = obj.number;
        this.url = obj.url;
        this.timestamp = obj.timestamp;
        this.duration = obj.duration;

    }
}
