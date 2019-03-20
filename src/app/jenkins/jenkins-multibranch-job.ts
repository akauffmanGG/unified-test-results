import * as _ from 'lodash';

export class JenkinsMultiBranchJob {
    jobs: any[];

    constructor(obj: any) {

        this.jobs = _.map(obj.jobs, name => (name));


        // if(obj.lastCompletedBuild) {
        //     this.lastCompletedBuild = (obj.lastCompletedBuild);
        // }

        // if(obj.lastFailedBuild) {
        //     this.lastFailedBuild = (obj.lastFailedBuild);
        // }

        // if(obj.lastStableBuild) {
        //     this.lastStableBuild = (obj.lastStableBuild);
        // }

        // if(obj.lastSuccessfulBuild) {
        //     this.lastSuccessfulBuild = (obj.lastSuccessfulBuild);
        // }

        // if(obj.lastUnstableBuild) {
        //     this.lastUnstableBuild = (obj.lastUnstableBuild);
        // }

        // if(obj.lastUnsuccessfulBuild) {
        //     this.lastUnsuccessfulBuild = (obj.lastUnsuccessfulBuild);
        // }

        // this.builds = _.map(obj.builds, _build => (_build));
    }
}