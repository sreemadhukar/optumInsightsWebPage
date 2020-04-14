import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentIntegrityComponent } from './new-payment-integrity.component';

describe('NewPaymentIntegrityComponent', () => {
  let component: NewPaymentIntegrityComponent;
  let fixture: ComponentFixture<NewPaymentIntegrityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPaymentIntegrityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentIntegrityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
