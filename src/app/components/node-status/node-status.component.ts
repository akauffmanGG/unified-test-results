import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import _ from 'lodash';

import { JenkinsService } from '@service/jenkins/jenkins.service';

import Node from './node';

@Component({
    selector: 'node-status',
    templateUrl: './node-status.component.html',
    styleUrls: ['./node-status.component.scss'],
    providers: [JenkinsService],
    animations: [
        trigger('spin', [
            state('start', style({
                transform: 'rotate(0deg)'
            })),
            state('end', style({
                transform: 'rotate(-360deg)'
            })),
            transition('start=>end', animate('500ms')),
            transition('end=>start', animate('500ms', keyframes([
                style({transform: 'rotate(-720deg'}) //necessary to make it appear to rotate counter clockwise each time
            ])))
        ])
    ]
})
export class NodeStatusComponent implements OnInit {

    nodes: Node[];

    animateState: string = 'start';


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
        this.updateIcatNodes();
    };

    updateIcatNodes() {
        this.animateState = this.animateState === 'start' ? 'end' : 'start';
        this.jenkinsService.getIcatNodes().then(_nodes => this.nodes = _.map(_nodes, _node => new Node(_node)));
    }

}