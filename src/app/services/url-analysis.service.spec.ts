import { TestBed, inject } from '@angular/core/testing';

import { UrlAnalysisService } from './url-analysis.service';

describe('UrlAnalysisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlAnalysisService]
    });
  });

  it('should be created', inject([UrlAnalysisService], (service: UrlAnalysisService) => {
    expect(service).toBeTruthy();
  }));
});
