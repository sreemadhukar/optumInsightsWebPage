import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewAdvocateComponent } from './overview-advocate.component';

describe('OverviewAdvocateComponent', () => {
  let component: OverviewAdvocateComponent;
  let fixture: ComponentFixture<OverviewAdvocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewAdvocateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewAdvocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
