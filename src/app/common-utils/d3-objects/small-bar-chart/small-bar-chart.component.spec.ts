import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallBarChartComponent } from './small-bar-chart.component';

describe('SmallBarChartComponent', () => {
  let component: SmallBarChartComponent;
  let fixture: ComponentFixture<SmallBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmallBarChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
