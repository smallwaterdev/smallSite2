import { TestBed, inject } from '@angular/core/testing';

import { FormattingService } from './formatting.service';

describe('FormattingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormattingService]
    });
  });

  it('should be created', inject([FormattingService], (service: FormattingService) => {
    expect(service).toBeTruthy();
  }));
});
