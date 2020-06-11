import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StarGreyComponent } from './d3-star-grey.component';

describe('D3StarGreyComponent', () => {
  let component: D3StarGreyComponent;
  let fixture: ComponentFixture<D3StarGreyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [D3StarGreyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StarGreyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
