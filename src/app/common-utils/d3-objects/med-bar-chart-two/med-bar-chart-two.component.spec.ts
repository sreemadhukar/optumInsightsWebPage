import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedBarChartTwoComponent } from './med-bar-chart-two.component';

describe('MedBarChartTwoComponent', () => {
  let component: MedBarChartTwoComponent;
  let fixture: ComponentFixture<MedBarChartTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedBarChartTwoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedBarChartTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
