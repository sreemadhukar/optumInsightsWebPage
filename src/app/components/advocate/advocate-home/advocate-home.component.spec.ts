import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvocateHomeComponent } from './advocate-home.component';

describe('AdvocateHomeComponent', () => {
  let component: AdvocateHomeComponent;
  let fixture: ComponentFixture<AdvocateHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvocateHomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
