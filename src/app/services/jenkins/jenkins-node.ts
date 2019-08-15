import _ from 'lodash'

export default class JenkinsNode {
    description: string;
    displayName: string;
    assignedLabels: string[];
    idle: boolean;
    offline: boolean;

    constructor (obj: any) {
        this.description = obj.description
        this.displayName = obj.displayName;
        this.assignedLabels = _.map(obj.assignedLabels, 'name');
        this.idle = obj.idle;
        this.offline = obj.offline;

    }
}