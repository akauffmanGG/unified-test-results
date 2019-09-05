import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }    from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingModule } from 'ngx-loading';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TestReportTableComponent } from './components/test-report-table/test-report-table.component';
import { TestReportViewComponent } from './components/test-report-view/test-report-view.component';
import { TestReportFilterComponent } from './components/test-report-filter/test-report-filter.component';
import { TestCaseHistoryComponent } from './components/test-case-history/test-case-history.component';
import { ErrorHistoryModalComponent } from './components/error-history-modal/error-history-modal.component';
import { JiraIssueSummaryComponent } from './components/jira-issue-summary/jira-issue-summary.component';
import { NodeStatusComponent } from './components/node-status/node-status.component';
import { NodeComponent } from './components/node-status/node.component';

@NgModule({
  declarations: [
    AppComponent,
    TestReportTableComponent,
    TestReportViewComponent,
    TestReportFilterComponent,
    TestCaseHistoryComponent,
    ErrorHistoryModalComponent,
    JiraIssueSummaryComponent,
    NodeStatusComponent,
    NodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    NgxDatatableModule,
    LoadingModule,
    NgbModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
