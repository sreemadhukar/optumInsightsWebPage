import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDataWarningMessageComponent } from './mock-data-warning-message.component';

describe('MockDataWarningMessageComponent', () => {
  let component: MockDataWarningMessageComponent;
  let fixture: ComponentFixture<MockDataWarningMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockDataWarningMessageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDataWarningMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
