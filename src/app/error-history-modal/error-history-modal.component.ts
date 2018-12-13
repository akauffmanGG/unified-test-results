import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'error-history-modal',
    templateUrl: './error-history-modal.component.html',
    styleUrls: ['./error-history-modal.component.scss'],
    providers: [NgbModal]
})
export class ErrorHistoryModalComponent {

    @Input() history: TestCaseJobResult[];
    name: string;

    constructor(private modalService: NgbModal) {}

    open(content) {
        var config:NgbModalOptions = {
            size: 'lg',
            windowClass: 'error-history-modal'
        }

        this.modalService.open(content, config);
    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.history.currentValue.length >0 ) {
            this.name = changes.history.currentValue[0].displayName;
        }
        
    }

}