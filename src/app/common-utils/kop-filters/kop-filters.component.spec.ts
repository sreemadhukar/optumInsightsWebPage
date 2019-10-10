import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopFiltersComponent } from './kop-filters.component';

describe('KopFiltersComponent', () => {
  let component: KopFiltersComponent;
  let fixture: ComponentFixture<KopFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KopFiltersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
