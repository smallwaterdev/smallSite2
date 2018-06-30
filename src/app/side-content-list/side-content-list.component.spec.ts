import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideContentListComponent } from './side-content-list.component';

describe('SideContentListComponent', () => {
  let component: SideContentListComponent;
  let fixture: ComponentFixture<SideContentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideContentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideContentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
