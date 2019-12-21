import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTopClaimsComponent } from './view-top-claims.component';

describe('ViewTopClaimsComponent', () => {
  let component: ViewTopClaimsComponent;
  let fixture: ComponentFixture<ViewTopClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewTopClaimsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTopClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
