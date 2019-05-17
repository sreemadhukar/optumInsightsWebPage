import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotatingArrowObjectComponent } from './rotating-arrow-object.component';

describe('RotatingArrowObjectComponent', () => {
  let component: RotatingArrowObjectComponent;
  let fixture: ComponentFixture<RotatingArrowObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RotatingArrowObjectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotatingArrowObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
