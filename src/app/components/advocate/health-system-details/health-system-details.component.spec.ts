import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthSystemDetailsComponent } from './health-system-details.component';

describe('HealthSystemDetailsComponent', () => {
  let component: HealthSystemDetailsComponent;
  let fixture: ComponentFixture<HealthSystemDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthSystemDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthSystemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
