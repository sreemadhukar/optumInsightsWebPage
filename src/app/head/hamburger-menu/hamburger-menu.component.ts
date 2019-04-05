import { Component, AfterViewInit, HostListener, ViewEncapsulation } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HamburgerMenuComponent {
  public mobileQuery: boolean;
  fillerNav = Array.from({ length: 6 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
  }
}
