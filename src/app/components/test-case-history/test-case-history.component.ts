import { Component, Input, OnChanges, AfterViewInit, ViewChild, SimpleChanges } from '@angular/core';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';
import { ErrorHistoryModalComponent } from '../error-history-modal/error-history-modal.component';
import _ from 'lodash';

@Component({
    selector: 'test-case-history',
    templateUrl: './test-case-history.component.html',
    styleUrls: ['./test-case-history.component.scss'],
})
export class TestCaseHistoryComponent implements OnChanges {
    @ViewChild('historyButton', {static: false}) historyButton: any;

    @Input() history: TestCaseJobResult[];

    failedResults: TestCaseJobResult[];

    ngOnChanges(changes: SimpleChanges) {
        this.failedResults = _.filter(changes.history.currentValue, 'isFailure' ).reverse();
    }

}