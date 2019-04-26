import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCareOpportunityComponent } from './patient-care-opportunity.component';

describe('PatientCareOpportunityComponent', () => {
  let component: PatientCareOpportunityComponent;
  let fixture: ComponentFixture<PatientCareOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientCareOpportunityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCareOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
