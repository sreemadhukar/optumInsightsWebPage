import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmReportComponent } from './adm-report.component';

describe('AdmReportComponent', () => {
  let component: AdmReportComponent;
  let fixture: ComponentFixture<AdmReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdmReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
