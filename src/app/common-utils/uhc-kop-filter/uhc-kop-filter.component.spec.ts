import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UhcKopFilterComponent } from './uhc-kop-filter.component';

describe('UhcKopFilterComponent', () => {
  let component: UhcKopFilterComponent;
  let fixture: ComponentFixture<UhcKopFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UhcKopFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UhcKopFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
