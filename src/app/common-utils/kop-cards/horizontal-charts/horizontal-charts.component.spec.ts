import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalChartsComponent } from './horizontal-charts.component';

describe('HorizontalChartsComponent', () => {
  let component: HorizontalChartsComponent;
  let fixture: ComponentFixture<HorizontalChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalChartsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
