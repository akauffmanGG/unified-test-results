import { Component, OnInit, Input } from '@angular/core';

import Node from './node';

@Component({
    selector: 'node',
    templateUrl: './node.component.html',
    providers: [],
    styleUrls: ['./node.component.scss'],
    host: { 
            'class': 'card mb-1 mx-1', 
            '[class.border-danger]': 'disabled',
            '[class.border-warning]': 'inUse',
            '[class.border-success]': 'available'
        }
})
export class NodeComponent implements OnInit {
    disabled: boolean;
    inUse: boolean;
    available: boolean;

    @Input() node: Node;

    ngOnInit(){
        this.disabled = this.node.status === 'disabled';
        this.inUse = this.node.status === 'in use';
        this.available = this.node.status === 'available';
    };
}