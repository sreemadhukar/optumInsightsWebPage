import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorAuthComponent } from './prior-auth.component';

describe('PriorAuthComponent', () => {
  let component: PriorAuthComponent;
  let fixture: ComponentFixture<PriorAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriorAuthComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
