import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpLongCardComponent } from './rlp-long-card.component';

describe('RlpLongCardComponent', () => {
  let component: RlpLongCardComponent;
  let fixture: ComponentFixture<RlpLongCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpLongCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpLongCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
