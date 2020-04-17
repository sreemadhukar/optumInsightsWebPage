import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpHeaderComponent } from './rlp-header.component';

describe('RlpHeaderComponent', () => {
  let component: RlpHeaderComponent;
  let fixture: ComponentFixture<RlpHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
