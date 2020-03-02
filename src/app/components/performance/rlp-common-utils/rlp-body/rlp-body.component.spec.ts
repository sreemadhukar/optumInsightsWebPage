import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RlpBodyComponent } from './rlp-body.component';

describe('RlpBodyComponent', () => {
  let component: RlpBodyComponent;
  let fixture: ComponentFixture<RlpBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RlpBodyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RlpBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
