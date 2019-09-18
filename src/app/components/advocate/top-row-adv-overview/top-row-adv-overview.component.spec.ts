import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRowAdvOverviewComponent } from './top-row-adv-overview.component';

describe('TopRowAdvOverviewComponent', () => {
  let component: TopRowAdvOverviewComponent;
  let fixture: ComponentFixture<TopRowAdvOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TopRowAdvOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRowAdvOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
