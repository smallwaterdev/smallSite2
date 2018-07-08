import { TestBed, inject } from '@angular/core/testing';

import { WatchLaterService } from './watch-later.service';

describe('WatchLaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WatchLaterService]
    });
  });

  it('should be created', inject([WatchLaterService], (service: WatchLaterService) => {
    expect(service).toBeTruthy();
  }));
});
