import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchLaterListComponent } from './watch-later-list.component';

describe('WatchLaterListComponent', () => {
  let component: WatchLaterListComponent;
  let fixture: ComponentFixture<WatchLaterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchLaterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchLaterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
