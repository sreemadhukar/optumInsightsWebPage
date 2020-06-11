import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersMultiSelectComponent } from './filters-multi-select.component';

describe('FiltersMultiSelectComponent', () => {
  let component: FiltersMultiSelectComponent;
  let fixture: ComponentFixture<FiltersMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersMultiSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersMultiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
