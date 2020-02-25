import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardinCredentialingComponent } from './onboardin-credentialing.component';

describe('OnboardinCredentialingComponent', () => {
  let component: OnboardinCredentialingComponent;
  let fixture: ComponentFixture<OnboardinCredentialingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardinCredentialingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardinCredentialingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
