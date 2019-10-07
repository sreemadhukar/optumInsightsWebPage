import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeCardKopComponent } from './large-card-kop.component';

describe('LargeCardKopComponent', () => {
  let component: LargeCardKopComponent;
  let fixture: ComponentFixture<LargeCardKopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LargeCardKopComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeCardKopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
