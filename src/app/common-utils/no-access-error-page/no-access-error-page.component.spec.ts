import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccessErrorPageComponent } from './no-access-error-page.component';

describe('NoAccessErrorPageComponent', () => {
  let component: NoAccessErrorPageComponent;
  let fixture: ComponentFixture<NoAccessErrorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoAccessErrorPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAccessErrorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
