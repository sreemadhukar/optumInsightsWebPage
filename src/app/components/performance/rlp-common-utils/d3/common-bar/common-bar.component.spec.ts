import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonBarComponent } from './common-bar.component';

describe('CommonBarComponent', () => {
  let component: CommonBarComponent;
  let fixture: ComponentFixture<CommonBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
