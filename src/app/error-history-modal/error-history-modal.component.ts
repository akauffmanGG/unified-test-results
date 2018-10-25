import { Component, Input, OnInit } from '@angular/core';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';

@Component({
    selector: 'error-history-modal',
    templateUrl: './error-history-modal.component.html',
    styleUrls: ['./error-history-modal.component.scss'],
})
export class ErrorHistoryModalComponent implements OnInit {

    // @Input()

    // history: TestCaseJobResult[];

    ngOnInit() {
    }

}