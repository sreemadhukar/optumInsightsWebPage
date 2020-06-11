import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeacSmallCardComponent } from './heac-small-card.component';

describe('HeacSmallCardComponent', () => {
  let component: HeacSmallCardComponent;
  let fixture: ComponentFixture<HeacSmallCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeacSmallCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeacSmallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
