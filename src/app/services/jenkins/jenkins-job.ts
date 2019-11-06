import { JenkinsBuild } from './jenkins-build';
import * as _ from 'lodash';

enum JOB_TYPE {
    WEB = 'WEB',
    ICWS = 'ICWS'
}

export class JenkinsJob {
    name: string;
    _displayName: string;
    color: string;
    url: string;

    private _type: JOB_TYPE;

    get type() {
        return this._type;
    }

    lastBuild: JenkinsBuild;
    lastCompletedBuild: JenkinsBuild;
    lastFailedBuild: JenkinsBuild;
    lastStableBuild: JenkinsBuild;
    lastSuccessfulBuild: JenkinsBuild;
    lastUnstableBuild: JenkinsBuild;
    lastUnsuccessfulBuild: JenkinsBuild;
    builds: JenkinsBuild[];

    get displayName(): string {
        return this._displayName;
    }

    constructor(obj: any) {
        this.name = obj.name;

        this.color = obj.color;

        this.url = obj.url;

        this._type = this.url.includes('icws') ? JOB_TYPE.ICWS : JOB_TYPE.WEB;

        this._displayName = this.name.replace('client.test.', '');

        this._displayName = this._type === 'WEB' ? ('WEB - ' + this._displayName) : ('ICWS - ' + this._displayName);

    }

    setBuildInfo(buildInfo: any) {
        if(buildInfo.lastBuild) {
            this.lastBuild = new JenkinsBuild(buildInfo.lastBuild);
        }

        if(buildInfo.lastCompletedBuild) {
            this.lastCompletedBuild = new JenkinsBuild(buildInfo.lastCompletedBuild);
        }

        if(buildInfo.lastFailedBuild) {
            this.lastFailedBuild = new JenkinsBuild(buildInfo.lastFailedBuild);
        }

        if(buildInfo.lastStableBuild) {
            this.lastStableBuild = new JenkinsBuild(buildInfo.lastStableBuild);
        }

        if(buildInfo.lastSuccessfulBuild) {
            this.lastSuccessfulBuild = new JenkinsBuild(buildInfo.lastSuccessfulBuild);
        }

        if(buildInfo.lastUnstableBuild) {
            this.lastUnstableBuild = new JenkinsBuild(buildInfo.lastUnstableBuild);
        }

        if(buildInfo.lastUnsuccessfulBuild) {
            this.lastUnsuccessfulBuild = new JenkinsBuild(buildInfo.lastUnsuccessfulBuild);
        }

        this.builds = _.map(buildInfo.builds, _build => new JenkinsBuild(_build));
    }
}
