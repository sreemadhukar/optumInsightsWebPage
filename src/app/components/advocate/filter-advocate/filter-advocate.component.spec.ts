import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterAdvocateComponent } from './filter-advocate.component';

describe('FilterAdvocateComponent', () => {
  let component: FilterAdvocateComponent;
  let fixture: ComponentFixture<FilterAdvocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FilterAdvocateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterAdvocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
