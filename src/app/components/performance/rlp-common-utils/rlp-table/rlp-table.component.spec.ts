import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpTableComponent } from './rlp-table.component';

describe('RlpTableComponent', () => {
  let component: RlpTableComponent;
  let fixture: ComponentFixture<RlpTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
