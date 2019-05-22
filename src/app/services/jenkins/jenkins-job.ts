import { JenkinsBuild } from './jenkins-build';
import * as _ from 'lodash';

export class JenkinsJob {
    lastBuild: JenkinsBuild;
    lastCompletedBuild: JenkinsBuild;
    lastFailedBuild: JenkinsBuild;
    lastStableBuild: JenkinsBuild;
    lastSuccessfulBuild: JenkinsBuild;
    lastUnstableBuild: JenkinsBuild;
    lastUnsuccessfulBuild: JenkinsBuild;
    builds: JenkinsBuild[];

    constructor(obj: any) {
        if(obj.lastBuild) {
            this.lastBuild = new JenkinsBuild(obj.lastBuild);
        }

        if(obj.lastCompletedBuild) {
            this.lastCompletedBuild = new JenkinsBuild(obj.lastCompletedBuild);
        }

        if(obj.lastFailedBuild) {
            this.lastFailedBuild = new JenkinsBuild(obj.lastFailedBuild);
        }

        if(obj.lastStableBuild) {
            this.lastStableBuild = new JenkinsBuild(obj.lastStableBuild);
        }

        if(obj.lastSuccessfulBuild) {
            this.lastSuccessfulBuild = new JenkinsBuild(obj.lastSuccessfulBuild);
        }

        if(obj.lastUnstableBuild) {
            this.lastUnstableBuild = new JenkinsBuild(obj.lastUnstableBuild);
        }

        if(obj.lastUnsuccessfulBuild) {
            this.lastUnsuccessfulBuild = new JenkinsBuild(obj.lastUnsuccessfulBuild);
        }

        this.builds = _.map(obj.builds, _build => new JenkinsBuild(_build));
    }
}
