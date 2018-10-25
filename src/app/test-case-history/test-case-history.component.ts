import { Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';

@Component({
    selector: 'test-case-history',
    templateUrl: './test-case-history.component.html',
    styleUrls: ['./test-case-history.component.scss'],
})
export class TestCaseHistoryComponent implements OnInit {
    @ViewChild('historyButton') historyButton: any;

    @Input()

    history: TestCaseJobResult[];

    ngOnInit() {
    }

    ngAfterViewInit() {
        //this.historyButton.popover();
    }

    showPopover() {

    }
}