import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorGreyMiniBarChartComponent } from './color-grey-mini-bar-chart.component';

describe('ColorGreyMiniBarChartComponent', () => {
  let component: ColorGreyMiniBarChartComponent;
  let fixture: ComponentFixture<ColorGreyMiniBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorGreyMiniBarChartComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorGreyMiniBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
