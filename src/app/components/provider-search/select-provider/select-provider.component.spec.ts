import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProviderComponent } from './select-provider.component';

describe('SelectProviderComponent', () => {
  let component: SelectProviderComponent;
  let fixture: ComponentFixture<SelectProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectProviderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
