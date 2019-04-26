import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPaymentsComponent } from './non-payments.component';

describe('NonPaymentsComponent', () => {
  let component: NonPaymentsComponent;
  let fixture: ComponentFixture<NonPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonPaymentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
