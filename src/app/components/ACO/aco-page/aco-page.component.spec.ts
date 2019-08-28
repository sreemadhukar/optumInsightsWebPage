import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoPageComponent } from './aco-page.component';

describe('AcoPageComponent', () => {
  let component: AcoPageComponent;
  let fixture: ComponentFixture<AcoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcoPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
