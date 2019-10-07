import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KopOverviewComponent } from './kop-overview.component';

describe('KopOverviewComponent', () => {
  let component: KopOverviewComponent;
  let fixture: ComponentFixture<KopOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KopOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KopOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
