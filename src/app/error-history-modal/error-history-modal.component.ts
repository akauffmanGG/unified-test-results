import { Component, Input, OnInit } from '@angular/core';
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

    constructor(private modalService: NgbModal) {}

    open(content) {
        var config:NgbModalOptions = {
            size: 'lg',
            windowClass: 'error-history-modal'
        }

        this.modalService.open(content, config);
    }

}