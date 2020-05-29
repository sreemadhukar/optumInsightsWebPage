import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcorModalComponent } from './pcor-modal.component';

describe('PcorModalComponent', () => {
  let component: PcorModalComponent;
  let fixture: ComponentFixture<PcorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PcorModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
