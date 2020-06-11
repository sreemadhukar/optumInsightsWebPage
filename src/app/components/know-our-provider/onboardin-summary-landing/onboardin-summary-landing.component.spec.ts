import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardinSummaryLandingComponent } from './onboardin-summary-landing.component';

describe('OnboardinSummaryLandingComponent', () => {
  let component: OnboardinSummaryLandingComponent;
  let fixture: ComponentFixture<OnboardinSummaryLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardinSummaryLandingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardinSummaryLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
