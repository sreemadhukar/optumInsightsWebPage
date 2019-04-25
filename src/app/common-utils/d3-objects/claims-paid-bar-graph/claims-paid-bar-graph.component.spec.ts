import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPaidBarGraphComponent } from './claims-paid-bar-graph.component';

describe('ClaimsPaidBarGraphComponent', () => {
  let component: ClaimsPaidBarGraphComponent;
  let fixture: ComponentFixture<ClaimsPaidBarGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsPaidBarGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsPaidBarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
