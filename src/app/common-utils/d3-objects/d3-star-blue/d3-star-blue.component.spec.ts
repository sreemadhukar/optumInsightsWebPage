import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3StarBlueComponent } from './d3-star-blue.component';

describe('D3StarBlueComponent', () => {
  let component: D3StarBlueComponent;
  let fixture: ComponentFixture<D3StarBlueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [D3StarBlueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3StarBlueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
