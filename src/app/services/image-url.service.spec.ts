import { TestBed, inject } from '@angular/core/testing';

import { ImageUrlService } from './image-url.service';

describe('ImageUrlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageUrlService]
    });
  });

  it('should be created', inject([ImageUrlService], (service: ImageUrlService) => {
    expect(service).toBeTruthy();
  }));
});
