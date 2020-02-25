import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingContractingComponent } from './onboarding-contracting.component';

describe('OnboardingContractingComponent', () => {
  let component: OnboardingContractingComponent;
  let fixture: ComponentFixture<OnboardingContractingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingContractingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingContractingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
