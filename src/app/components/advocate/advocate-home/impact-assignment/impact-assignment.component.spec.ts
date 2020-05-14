import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactAssignmentComponent } from './impact-assignment.component';

describe('ImpactAssignmentComponent', () => {
  let component: ImpactAssignmentComponent;
  let fixture: ComponentFixture<ImpactAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImpactAssignmentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
