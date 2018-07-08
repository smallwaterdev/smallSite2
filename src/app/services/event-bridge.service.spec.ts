import { TestBed, inject } from '@angular/core/testing';

import { EventBridgeService } from './event-bridge.service';

describe('EventBridgeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventBridgeService]
    });
  });

  it('should be created', inject([EventBridgeService], (service: EventBridgeService) => {
    expect(service).toBeTruthy();
  }));
});
