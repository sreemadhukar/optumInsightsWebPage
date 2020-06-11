import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderTrendsComponent } from './provider-trends.component';

describe('ProviderTrendsComponent', () => {
  let component: ProviderTrendsComponent;
  let fixture: ComponentFixture<ProviderTrendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProviderTrendsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
