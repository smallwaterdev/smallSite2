import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetaNavComponent } from './meta-nav.component';

describe('MetaNavComponent', () => {
  let component: MetaNavComponent;
  let fixture: ComponentFixture<MetaNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetaNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
