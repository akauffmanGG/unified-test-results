import _ from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { TestReport } from '../test-report-view/test-report';
import TestCaseResult from '../test-report-view/test-case-result';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';

@Component({
    selector: 'test-report-filter',
    templateUrl: './test-report-filter.component.html',
    providers: []
})
export class TestReportFilterComponent implements OnInit {
    @Input()
    testReport: TestReport;

    selectedStatuses: { failed:  boolean, passed: boolean } = {failed: false, passed: false};
    selectedScr: string = 'ALL';
    selectedPriorities: { P1: boolean, P2: boolean, P3: boolean, P4: boolean } = { P1: false, P2: false, P3: false, P4: false };
    findScr: string;
    findTestCase: string;
    findErrorMessage: string;

    constructor() {
    }

    ngOnInit() {
    }

    scrSearch(): void {
        if(this.findScr) {
            this.selectedScr = 'SCR';
        }
        this.filterRows();
    }

    filterRows(): void {
        this.testReport.displayedRows = _.filter(this.testReport.testCaseResults, (result: TestCaseResult) => {
            return this.isFilteredToStatus(result) &&
                this.isFilteredToScr(result) &&
                this.isSearchedScr(result) &&
                this.isSearchedTestCase(result) &&
                this.isSearchedErrorMessage(result) && 
                this.isFilteredToPriority(result);
        });
    }

    private isFilteredToStatus(result: TestCaseResult): boolean {
        if(!this.selectedStatuses.failed && !this.selectedStatuses.passed){
            return true;
        }

        if(result.jobResult.isFailure) {
            return this.selectedStatuses.failed;
        } else {
            return this.selectedStatuses.passed;
        }
    }

    private isFilteredToScr(result: TestCaseResult): boolean {
        if(this.selectedScr == 'ALL') {
            return true;
        }

        if(this.selectedScr == 'SCR') {
            return !!result.jiraIssue;
        }

        if(this.selectedScr == 'NEEDS_SCR') {
            return result.needsJiraIssue;
        }

        if(this.selectedScr == 'NONE') {
            return !result.needsJiraIssue && !result.jiraIssue;
        }
    }

    private isSearchedScr(result: TestCaseResult): boolean {
        if(!this.findScr) {
            return true;
        }

        return result.jiraIssue.key.toLowerCase().includes(this.findScr.toLowerCase());
    }

    private isSearchedTestCase(result: TestCaseResult): boolean {
        if(!this.findTestCase) {
            return true;
        }

        if(!result.displayName) {
            return false;
        }

        return result.displayName.toLowerCase().includes(this.findTestCase.toLowerCase());
    }

    private isSearchedErrorMessage(result: TestCaseResult): boolean {
        if(!this.findErrorMessage) {
            return true;
        }

        if(_.find(result.history, (jobResult: TestCaseJobResult) => jobResult.errorMessage.toLowerCase().includes(this.findErrorMessage.toLowerCase()))) {
            return true;
        }

        return false;
    }

    private isFilteredToPriority(result: TestCaseResult): boolean {
        if(!this.selectedPriorities.P1 &&
            !this.selectedPriorities.P2 &&
            !this.selectedPriorities.P3 &&
            !this.selectedPriorities.P4) {

            return true;
        }

        if(!result.priority) {
            return false;
        }

        return this.selectedPriorities[result.priority];
    }

    clearFilters(): void {
        this.selectedStatuses = {failed: false, passed: false};
        this.selectedScr = 'ALL';
        this.findScr = '';
        this.findTestCase = '';
        this.findErrorMessage = '';
        this.selectedPriorities = { P1: false, P2: false, P3: false, P4: false };

        this.filterRows();
    }

}
