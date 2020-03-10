import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSelectorComponent } from './print-selector.component';

describe('PrintSelectorComponent', () => {
  let component: PrintSelectorComponent;
  let fixture: ComponentFixture<PrintSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
