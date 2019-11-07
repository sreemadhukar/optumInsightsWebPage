import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersAppliedComponent } from './filters-applied.component';

describe('FiltersAppliedComponent', () => {
  let component: FiltersAppliedComponent;
  let fixture: ComponentFixture<FiltersAppliedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersAppliedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
