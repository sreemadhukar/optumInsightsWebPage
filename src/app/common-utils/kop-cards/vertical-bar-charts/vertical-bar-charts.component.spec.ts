import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalBarChartsComponent } from './vertical-bar-charts.component';

describe('VerticalBarChartsComponent', () => {
  let component: VerticalBarChartsComponent;
  let fixture: ComponentFixture<VerticalBarChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalBarChartsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalBarChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
