import { TestBed, async } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import 'zone.js/dist/zone-testing';

describe('FilterService', () => {
  beforeEach(async(() => {
    TestBed.resetTestEnvironment(); // new
    TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting()); // new

    TestBed.configureTestingModule({
      declarations: [FilterService]
    }).compileComponents();
  }));

  it('should create TestedComponent', async(() => {
    const fixture = TestBed.createComponent(FilterService);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
