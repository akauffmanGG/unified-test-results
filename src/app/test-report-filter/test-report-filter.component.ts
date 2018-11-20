import _ from 'lodash';
import { Component, OnInit, Input } from '@angular/core';
import { TestReport } from '../test-report-view/test-report';
import TestCaseResult from '../test-report-view/test-case-result';
import { Team, Teams } from '../test-report-view/team';
import { TestCaseJobResult } from '../test-report-view/test-case-job-result';

@Component({
    selector: 'test-report-filter',
    templateUrl: './test-report-filter.component.html',
    providers: []
})
export class TestReportFilterComponent implements OnInit {
    @Input()
    testReport: TestReport;
    @Input()
    testResults: TestCaseResult[];

    selectedQaStatus: string = 'ALL';
    selectedMainStatus: string = 'ALL';
    teams: Team[] = Teams;
    selectedTeams: Team[] = Teams;
    selectedScr: string = 'ALL';
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
        this.testReport.displayedRows = _.filter(this.testResults, (result: TestCaseResult) => {
            return this.isFilteredToQaStatus(result) &&
                this.isFilteredToMainStatus(result) &&
                this.isFilteredToTeam(result) &&
                this.isFilteredToScr(result) &&
                this.isSearchedScr(result) &&
                this.isSearchedTestCase(result) &&
                this.isSearchedErrorMessage(result);
        });
    }

    private isFilteredToQaStatus(result: TestCaseResult): boolean {
        if(this.selectedQaStatus === 'ALL') {
            return true;
        }

        if(this.selectedQaStatus === 'NONE') {
            return false;
        }

        if(this.selectedQaStatus === 'FAILED') {
            return result.qaResult.isFailure;
        }

        if(this.selectedQaStatus === 'PASSED') {
            return !result.qaResult.isFailure;
        }
    }

    private isFilteredToMainStatus(result: TestCaseResult): boolean {
        if(this.selectedMainStatus === 'ALL') {
            return true;
        }

        if(this.selectedMainStatus === 'NONE') {
            return false;
        }

        if(this.selectedMainStatus === 'FAILED') {
            return result.mainResult.isFailure;
        }

        if(this.selectedMainStatus === 'PASSED') {
            return !result.mainResult.isFailure;
        }
    }

    private isFilteredToTeam(result: TestCaseResult): boolean {
        return this.selectedTeams.includes(result.team);
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

        return result.displayName.toLowerCase().includes(this.findTestCase.toLowerCase());
    }

    private isSearchedErrorMessage(result: TestCaseResult): boolean {
        if(!this.findErrorMessage) {
            return true;
        }

        if(_.find(result.qaHistory, (jobResult: TestCaseJobResult) => jobResult.errorMessage.toLowerCase().includes(this.findErrorMessage.toLowerCase()))) {
            return true;
        }

        if(_.find(result.mainHistory, (jobResult: TestCaseJobResult) => jobResult.errorMessage.toLowerCase().includes(this.findErrorMessage.toLowerCase()))) {
            return true;
        }

        return false;
    }

    clearFilters(): void {
        this.selectedQaStatus = 'ALL';
        this.selectedMainStatus = 'ALL';
        this.selectedTeams = this.teams;
        this.selectedScr = 'ALL';
        this.findScr = '';
        this.findTestCase = '';
        this.findErrorMessage = '';

        this.filterRows();
    }

}
