import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIntegrityComponent } from './payment-integrity.component';

describe('PaymentIntegrityComponent', () => {
  let component: PaymentIntegrityComponent;
  let fixture: ComponentFixture<PaymentIntegrityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentIntegrityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentIntegrityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
