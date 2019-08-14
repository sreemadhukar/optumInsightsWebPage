import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POverviewComponent } from './p-overview.component';

describe('POverviewComponent', () => {
  let component: POverviewComponent;
  let fixture: ComponentFixture<POverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [POverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
