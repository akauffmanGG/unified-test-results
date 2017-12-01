import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import TestCaseResult from './test-case-result';

@Injectable()
export class FilterResults {
    showQa: boolean;
    showMain: boolean;
    showOnlyFailures: boolean;
    showOnlyConsistentFailures: boolean;
    showOnlyBothFailures: boolean;
    showFixedIssues: boolean;


    filter(results: TestCaseResult[]): TestCaseResult[] {
        return _.filter(results, (result: TestCaseResult) => {
            return this.isFilteredToBuild(result) &&
                this.isFilteredToConsistentFailures(result) &&
                this.isFilteredToOnlyFailures(result) &&
                this.isFilteredToBothFailures(result) &&
                this.isFilteredToFixedIssues(result);
        });
    }

    private isFilteredToBuild(result: TestCaseResult): boolean {
        if(this.showQa && this.showMain){
            return true;
        }

        if (!this.showQa && !result.mainResult.status) {
            return false;
        }

        if (!this.showMain && !result.qaResult.status) {
            return false;
        }

        return true;
    }

    private isFilteredToOnlyFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyFailures) {
            return true;
        }

        if (!result.qaResult.isFailure && !result.mainResult.isFailure) {
            return false;
        }

        if (!result.qaResult.isFailure && !this.showMain) {
            return false;
        }
        if (!result.mainResult.isFailure && !this.showQa) {
            return false;
        }

        return true;
    }

    private isFilteredToConsistentFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyConsistentFailures) {
            return true;
        }

        if(!result.isConsistentlyFailing) {
            return false;
        }

        if (!result.qaResult.isConsistentlyFailing && !this.showMain) {
            return false;
        }
        if (!result.mainResult.isConsistentlyFailing && !this.showQa) {
            return false;
        }

        return true;
    }

    private isFilteredToBothFailures(result: TestCaseResult): boolean {
        if(!this.showOnlyBothFailures) {
            return true;
        }

        if (!result.qaResult.isFailure || !result.mainResult.isFailure) {
            return false;
        }

        return true;
    }

    private isFilteredToFixedIssues(result: TestCaseResult): boolean {
        if(!this.showFixedIssues) {
            return true;
        }

        if(!result.jiraIssue || (result.qaResult.isFailure && result.mainResult.isFailure)) {
            return false;
        }

        if(!result.qaResult.isFailure && !result.mainResult.isFailure) {
            return true;
        }

        if((result.mainResult.isFailure && !this.showMain) || (result.qaResult.isFailure && !this.showQa)) {
            return true;
        }

    }
}
