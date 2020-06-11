import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UhciFiltersComponent } from './uhci-filters.component';

describe('UhciFiltersComponent', () => {
  let component: UhciFiltersComponent;
  let fixture: ComponentFixture<UhciFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UhciFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UhciFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
