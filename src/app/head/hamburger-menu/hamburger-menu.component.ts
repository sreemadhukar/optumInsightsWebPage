import { Component, AfterViewInit, HostListener, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';

import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HamburgerMenuComponent implements AfterViewInit {
  public mobileQuery: boolean;
  public healthSystemName = 'North Region Health System';
  public subMenuExpandState = false;

  /*** Array of Navigation Category List ***/
  public navCategories = [
    { icon: 'home', name: 'Overview', path: '/' },
    {
      icon: 'home',
      name: 'Getting Reimbursed',
      children: [
        { name: 'Summary', path: 'GettingReimbursedSummary' },
        { name: 'Payments', path: '#' },
        { name: 'Non-Payments', path: '#' },
        { name: 'Appelas', path: '#' },
        { name: 'Payment Integrity', path: '#' }
      ]
    },
    {
      icon: 'home',
      name: 'Care Delivery',
      children: [{ name: 'Prior Authorizations', path: '#' }, { name: 'Patient Care Opportunity', path: '#' }]
    },
    {
      icon: 'home',
      name: 'Issue Resolution',
      children: [{ name: 'Summary', path: '#' }]
    }
  ];

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-home-24px.svg')
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
  }

  /*** used to apply the CSS for dynamically generated elements ***/
  public ngAfterViewInit(): void {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.mat-list-item') as HTMLElement[];
    const listItemContents = this.elementRef.nativeElement.querySelectorAll('.mat-list-item-content') as HTMLElement[];
    const listItemBody = this.elementRef.nativeElement.querySelectorAll('.mat-expansion-panel-body') as HTMLElement[];
    Array.from(listItemContents).forEach(listItem => {
      this.renderer.setStyle(listItem, 'padding', '0px');
      this.renderer.setStyle(listItem, 'height', 'auto');
    });
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'height', 'auto');
      this.renderer.setStyle(listItem, 'padding', '8px 12px 8px 65px');
      this.renderer.setStyle(listItem, 'width', 'auto');
    });
    Array.from(listItemBody).forEach(listItem => {
      this.renderer.setStyle(listItem, 'padding', '0px');
    });
  }

  collapseExpansionPanels() {
    this.subMenuExpandState = false;
    alert('HI');
  }
}
