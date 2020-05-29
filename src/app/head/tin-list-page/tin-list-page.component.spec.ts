import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinListPageComponent } from './tin-list-page.component';

describe('TinListPageComponent', () => {
  let component: TinListPageComponent;
  let fixture: ComponentFixture<TinListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TinListPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TinListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
