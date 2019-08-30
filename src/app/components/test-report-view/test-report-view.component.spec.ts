import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestReportViewComponent } from './test-report-view.component';

describe('TestReportViewComponent', () => {
  let component: TestReportViewComponent;
  let fixture: ComponentFixture<TestReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
