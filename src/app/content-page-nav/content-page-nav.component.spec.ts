import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPageNavComponent } from './content-page-nav.component';

describe('ContentPageNavComponent', () => {
  let component: ContentPageNavComponent;
  let fixture: ComponentFixture<ContentPageNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPageNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
