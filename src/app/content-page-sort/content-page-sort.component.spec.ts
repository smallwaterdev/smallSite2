import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPageSortComponent } from './content-page-sort.component';

describe('ContentPageSortComponent', () => {
  let component: ContentPageSortComponent;
  let fixture: ComponentFixture<ContentPageSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPageSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
