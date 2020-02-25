import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopOnboardingComponent } from './kop-onboarding.component';

describe('KopOnboardingComponent', () => {
  let component: KopOnboardingComponent;
  let fixture: ComponentFixture<KopOnboardingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KopOnboardingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
