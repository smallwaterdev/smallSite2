import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Router , NavigationEnd} from '@angular/router';
import { ContentNavComponent } from './content-nav.component';

describe('ContentNavComponent', () => {
  let component: ContentNavComponent;
  let fixture: ComponentFixture<ContentNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
