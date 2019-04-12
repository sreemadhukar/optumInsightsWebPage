import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginStubComponent } from './login-stub.component';

describe('LoginStubComponent', () => {
  let component: LoginStubComponent;
  let fixture: ComponentFixture<LoginStubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginStubComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginStubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
