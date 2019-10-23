import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOverviewComponent } from './print-overview.component';

describe('PrintOverviewComponent', () => {
  let component: PrintOverviewComponent;
  let fixture: ComponentFixture<PrintOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
