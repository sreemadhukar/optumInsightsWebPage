import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpCommonBarComponent } from './rlp-common-bar.component';

describe('RlpCommonBarComponent', () => {
  let component: RlpCommonBarComponent;
  let fixture: ComponentFixture<RlpCommonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpCommonBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpCommonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
