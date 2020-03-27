import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpTableItemComponent } from './rlp-table-item.component';

describe('RlpTableItemComponent', () => {
  let component: RlpTableItemComponent;
  let fixture: ComponentFixture<RlpTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpTableItemComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
