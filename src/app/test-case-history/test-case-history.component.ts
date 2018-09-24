import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'test-case-history',
    templateUrl: './test-case-history.component.html',
    styleUrls: ['./test-case-history.component.scss'],
})
export class TestCaseHistoryComponent implements OnInit {
    @Input()

    history: boolean[];

    ngOnInit() {
    }
}