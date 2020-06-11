import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeCardAdvocateComponent } from './large-card-advocate.component';

describe('LargeCardAdvocateComponent', () => {
  let component: LargeCardAdvocateComponent;
  let fixture: ComponentFixture<LargeCardAdvocateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LargeCardAdvocateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeCardAdvocateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
