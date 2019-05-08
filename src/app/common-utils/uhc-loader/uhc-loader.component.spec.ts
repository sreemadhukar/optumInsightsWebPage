import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UhcLoaderComponent } from './uhc-loader.component';

describe('UhcLoaderComponent', () => {
  let component: UhcLoaderComponent;
  let fixture: ComponentFixture<UhcLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UhcLoaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UhcLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
