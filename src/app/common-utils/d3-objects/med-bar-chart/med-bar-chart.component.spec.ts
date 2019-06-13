import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedBarChartComponent } from './med-bar-chart.component';

describe('MedBarChartComponent', () => {
  let component: MedBarChartComponent;
  let fixture: ComponentFixture<MedBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedBarChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
