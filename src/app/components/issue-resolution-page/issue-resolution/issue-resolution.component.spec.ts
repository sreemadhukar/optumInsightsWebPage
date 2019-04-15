import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueResolutionComponent } from './issue-resolution.component';

describe('IssueResolutionComponent', () => {
  let component: IssueResolutionComponent;
  let fixture: ComponentFixture<IssueResolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IssueResolutionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueResolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
