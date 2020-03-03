import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingVerbatimsComponent } from './onboarding-verbatims.component';

describe('OnboardingVerbatimsComponent', () => {
  let component: OnboardingVerbatimsComponent;
  let fixture: ComponentFixture<OnboardingVerbatimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingVerbatimsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingVerbatimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
