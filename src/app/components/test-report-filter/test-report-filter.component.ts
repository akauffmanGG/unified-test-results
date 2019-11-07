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

    selectedStatus: string = 'ALL';
    selectedScr: string = 'ALL';
    selectedPriorities: string[] = ['P1', 'P2', 'P3', 'P4'];
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
            return this.isFilteredToQaStatus(result) &&
                this.isFilteredToScr(result) &&
                this.isSearchedScr(result) &&
                this.isSearchedTestCase(result) &&
                this.isSearchedErrorMessage(result) && 
                this.isFilteredToPriority(result);
        });
    }

    private isFilteredToQaStatus(result: TestCaseResult): boolean {
        if(this.selectedStatus === 'ALL') {
            return true;
        }

        if(this.selectedStatus === 'NONE') {
            return false;
        }

        if(this.selectedStatus === 'FAILED') {
            return result.jobResult.isFailure;
        }

        if(this.selectedStatus === 'PASSED') {
            return !result.jobResult.isFailure;
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
        if(this.selectedPriorities.length === 4){
            return true;
        }

        if(_.indexOf(this.selectedPriorities, result.priority) > -1) {
            return true;
        }

        return false;
    }

    clearFilters(): void {
        this.selectedStatus = 'ALL';
        this.selectedScr = 'ALL';
        this.findScr = '';
        this.findTestCase = '';
        this.findErrorMessage = '';
        this.selectedPriorities = ['P1', 'P2', 'P3', 'P4'];

        this.filterRows();
    }

}
