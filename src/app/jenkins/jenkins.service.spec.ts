import { TestBed, inject } from '@angular/core/testing';

import { JenkinsService } from './jenkins.service';

describe('BuildDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JenkinsService]
    });
  });

  it('should be created', inject([JenkinsService], (service: JenkinsService) => {
    expect(service).toBeTruthy();
  }));
});
