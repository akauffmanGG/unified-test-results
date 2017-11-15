import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }    from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { TestReportTableComponent } from './test-report-table/test-report-table.component';
import { TestReportViewComponent } from './test-report-view/test-report-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TestReportTableComponent,
    TestReportViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    NgxDatatableModule,
    LoadingModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
