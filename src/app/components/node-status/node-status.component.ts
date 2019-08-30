import { Component, OnInit } from '@angular/core';
import _ from 'lodash';

import { JenkinsService } from '@service/jenkins/jenkins.service';

import Node from './node';

@Component({
    selector: 'node-status',
    templateUrl: './node-status.component.html',
    styleUrls: ['./node-status.component.scss'],
    providers: [JenkinsService]
})
export class NodeStatusComponent implements OnInit {

    nodes: Node[];

    get availableNodes() : number {
        return _.filter(this.nodes, ['status', 'available']);
    }

    get inUseNodes() : number {
        return _.filter(this.nodes, ['status', 'in use']);
    }

    get disabledNodes() : number {
        return _.filter(this.nodes, ['status', 'disabled']);
    }

    constructor(private jenkinsService: JenkinsService) {
    }

    ngOnInit(){
        this.jenkinsService.getIcatNodes().then(_nodes => this.nodes = _.map(_nodes, _node => new Node(_node)));
    };
}