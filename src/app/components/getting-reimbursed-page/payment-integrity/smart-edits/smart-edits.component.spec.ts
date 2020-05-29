import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartEditsComponent } from './smart-edits.component';

describe('SmartEditsComponent', () => {
  let component: SmartEditsComponent;
  let fixture: ComponentFixture<SmartEditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SmartEditsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartEditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
