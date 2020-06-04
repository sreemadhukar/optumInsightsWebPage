import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiSubmissionComponent } from './edi-submission.component';

describe('EdiSubmissionComponent', () => {
  let component: EdiSubmissionComponent;
  let fixture: ComponentFixture<EdiSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EdiSubmissionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdiSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
