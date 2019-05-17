import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniTileComponent } from './mini-tile.component';

describe('MiniTileComponent', () => {
  let component: MiniTileComponent;
  let fixture: ComponentFixture<MiniTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
