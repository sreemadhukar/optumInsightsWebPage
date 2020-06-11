import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionLargeCardComponent } from './accordion-large-card.component';

describe('AccordionLargeCardComponent', () => {
  let component: AccordionLargeCardComponent;
  let fixture: ComponentFixture<AccordionLargeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccordionLargeCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionLargeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
