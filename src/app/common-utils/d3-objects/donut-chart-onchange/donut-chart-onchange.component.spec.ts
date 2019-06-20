import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonutChartOnchangeComponent } from './donut-chart-onchange.component';

describe('DonutChartOnchangeComponent', () => {
  let component: DonutChartOnchangeComponent;
  let fixture: ComponentFixture<DonutChartOnchangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DonutChartOnchangeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonutChartOnchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
