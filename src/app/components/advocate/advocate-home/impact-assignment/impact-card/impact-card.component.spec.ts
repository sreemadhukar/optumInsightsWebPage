import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactCardComponent } from './impact-card.component';

describe('ImpactCardComponent', () => {
  let component: ImpactCardComponent;
  let fixture: ComponentFixture<ImpactCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImpactCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
