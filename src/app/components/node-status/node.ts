import JenkinsNode from '@service/jenkins/jenkins-node';
import _ from 'lodash';

export default class Node {
    description: string;
    displayName: string;
    assignedLabels: string[];
    idle: boolean;
    offline: boolean;

    get statusDescription() : string {
        //order matters here

        if(this.offline) {
            return "offline";
        }

        if(this.assignedLabels.includes('icat-test-in-use')) {
            return "in use";
        }

        if(!this.assignedLabels.includes('icat-test')) {
            return "unavailable";
        }

        if(this.idle) {
            return "idle";
        }

        return "unknown";
    }

    get status() : string {
        if (this.statusDescription === 'unavailable' || this.statusDescription === 'offline' || this.statusDescription === 'unknown') {
            return 'disabled';
        }

        if(this.statusDescription === 'in use') {
            return 'in use';
        }

        if(this.statusDescription === 'idle') {
            return 'available';
        }
    }

    get url() : string {
        return 'https://ci.qfun.com/computer/' + this.displayName;
    }

    constructor (obj: JenkinsNode) {
        this.description = obj.description
        this.displayName = obj.displayName;
        this.assignedLabels = obj.assignedLabels;
        this.idle = obj.idle;
        this.offline = obj.offline;

    }
}