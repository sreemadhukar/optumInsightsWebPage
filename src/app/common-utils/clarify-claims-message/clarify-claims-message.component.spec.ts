import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClarifyClaimsMessageComponent } from './clarify-claims-message.component';

describe('ClarifyClaimsMessageComponent', () => {
  let component: ClarifyClaimsMessageComponent;
  let fixture: ComponentFixture<ClarifyClaimsMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClarifyClaimsMessageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarifyClaimsMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
