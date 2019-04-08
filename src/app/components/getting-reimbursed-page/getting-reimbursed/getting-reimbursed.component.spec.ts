import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GettingReimbursedComponent } from './getting-reimbursed.component';

describe('GettingReimbursedComponent', () => {
  let component: GettingReimbursedComponent;
  let fixture: ComponentFixture<GettingReimbursedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GettingReimbursedComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GettingReimbursedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
