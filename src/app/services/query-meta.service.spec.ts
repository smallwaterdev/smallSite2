import { TestBed, inject } from '@angular/core/testing';

import { QueryMetaService } from './query-meta.service';

describe('QueryMetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryMetaService]
    });
  });

  it('should be created', inject([QueryMetaService], (service: QueryMetaService) => {
    expect(service).toBeTruthy();
  }));
});
