/**
 * Author: Ranjith kumar Ankam
 * Created Date: 03-Apr-2019
 *  **/

import {
  Component,
  AfterViewInit,
  OnInit,
  HostListener,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  ViewChildren,
  ViewChild,
  QueryList,
  OnDestroy,
  Input
} from '@angular/core';
import { MatExpansionPanel, MatDialog, MatSidenav } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from '../../auth/_service/authentication.service';
import { ThemeService } from '../../shared/theme.service';
import { Observable } from 'rxjs';
import { ProviderSearchComponent } from '../../common-utils/provider-search/provider-search.component';
import { StorageService } from '../../shared/storage-service.service';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { Subscription } from 'rxjs';
import { PriorAuthSharedService } from 'src/app/shared/prior-authorization/prior-auth.service';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HamburgerMenuComponent implements AfterViewInit, OnInit, OnDestroy {
  _allExpandState = false;
  isDarkTheme: Observable<boolean>;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('srnav') srnav: MatSidenav;
  public healthSystemName = JSON.parse(sessionStorage.getItem('currentUser'))
    ? JSON.parse(sessionStorage.getItem('currentUser'))[0]['HealthCareOrganizationName']
    : '';
  public makeAbsolute: boolean;
  public sideNavFlag = true;
  subscription: any;
  public glossaryFlag: boolean;
  public glossaryTitle: string = null;
  clickHelpIcon: Subscription;
  public mobileQuery: boolean;
  public PCORFlag: boolean;
  /*** Array of Navigation Category List ***/
  public navCategories = [
    { icon: 'home', name: 'Overview', path: '/OverviewPage', disabled: false },
    {
      icon: 'getting-reimburse',
      name: 'Getting Reimbursed',
      children: [
        { name: 'Summary', path: '/GettingReimbursed' },
        { name: 'Payments', path: '/GettingReimbursed/Payments' },
        { name: 'Non-Payments', path: '/GettingReimbursed/NonPayments' },
        { name: 'Appeals', path: '/GettingReimbursed/Appeals' }
        // { name: 'Payment Integrity', path: '/OverviewPage' }
      ]
    },
    {
      icon: 'care-delivery',
      name: 'Care Delivery',
      children: [
        { name: 'Prior Authorizations', path: '/CareDelivery/priorAuth' }
        // { name: 'Patient Care Opportunity', path: '/OverviewPage' }
      ]
    },
    {
      icon: 'issue-resolution',
      name: 'Issue Resolution',
      children: [
        { name: 'Self Service', path: '/IssueResolution/SelfService' },
        { name: 'Calls', path: '/IssueResolution/Calls' }
      ]
    }
  ];

  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);

  /** CONSTRUCTOR **/
  constructor(
    private breakpointObserver: BreakpointObserver,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private iconRegistry: MatIconRegistry,
    private router: Router,
    private authService: AuthenticationService,
    sanitizer: DomSanitizer,
    private themeService: ThemeService,
    private dialog: MatDialog,
    private checkStorage: StorageService,
    private glossaryExpandService: GlossaryExpandService,
    private priorAuthShared: PriorAuthSharedService
  ) {
    this.glossaryFlag = false;
    // to disable the header/footer/body when not authenticated
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.makeAbsolute = !(authService.isLoggedIn() && !(event.url === '' || event.url.indexOf('/login') >= 0));
      }
      // PLEASE DON'T MODIFY THIS
    });

    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'home',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-home-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'getting-reimburse',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-attach_money-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'care-delivery',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-favorite-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'issue-resolution',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-stars-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'sign-out',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-input-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-search-24px.svg')
    );
  }
  ngOnInit() {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.healthSystemName = JSON.parse(sessionStorage.getItem('currentUser'))[0]['HealthCareOrganizationName'];
    });

    // For first load
    /*
    this.priorAuthShared.getPCORData().then(data => {
      this.PCORFlag = data;
      if (this.PCORFlag) {
        this.navCategories[2].children.push({
          name: 'Patient Care Opportunity',
          path: '/CareDelivery/PatientCareOpportunity'
        });
      }
    });
    */

    this.priorAuthShared.getPriorAuthNotApprovedReasons().then(data => {
      console.log(data);
    });

    this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.priorAuthShared.getPCORData().then(data => {
        if (this.PCORFlag === data) {
          // Do nothing
        } else {
          if (data) {
            this.navCategories[2].children.push({
              name: 'Patient Care Opportunity',
              path: '/CareDelivery/PatientCareOpportunity'
            });
            this.PCORFlag = data;
          } else {
            this.navCategories[2].children.splice(
              this.navCategories[2].children.indexOf({
                name: 'Patient Care Opportunity',
                path: '/CareDelivery/PatientCareOpportunity'
              }),
              1
            );
            this.PCORFlag = data;
          }
        }
        console.log(this.navCategories[2].children);
      });
    });

    this.clickHelpIcon = this.glossaryExpandService.message.subscribe(
      data => {
        this.glossaryFlag = true;
        this.glossaryTitle = data;
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );
  }

  ngOnDestroy() {
    this.clickHelpIcon.unsubscribe();
    this.glossaryFlag = false;
    this.glossaryTitle = null;
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
      this.renderer.setStyle(listItem, 'padding', '8px 12px 8px 43px');
      this.renderer.setStyle(listItem, 'width', 'auto');
    });
    Array.from(listItemBody).forEach(listItem => {
      this.renderer.setStyle(listItem, 'padding', '0px');
    });
  }
  hamburgerDisplay(input: boolean) {
    this.sideNavFlag = input;
    // alert(this.sideNavFlag);
  }

  toggleDarkTheme(isDarkTheme: boolean) {
    this.themeService.setDarkTheme(isDarkTheme);
  }
  /** FUNCTIONS TO COLLAPSE LEFT MENU **/
  collapseExpansionPanels(id) {
    this.allExpandState(false, id - 1);
  }

  openDialog(): void {
    this.dialog.open(ProviderSearchComponent, {
      width: '550px',
      height: '212px',
      disableClose: true
    });
  }

  closeGlossary() {
    this.glossaryFlag = false;
    this.glossaryTitle = null;
  }

  signOut() {
    this.authService.logout();
  }
  public close() {
    this.srnav.disableClose = true;
  }
  private allExpandState(value: boolean, id) {
    this._allExpandState = value;
    this.togglePanels(value, id);
  }

  private togglePanels(value: boolean, id) {
    // this.viewPanels.forEach(p => value ? p.open() : p.close());

    /** USED TO COLLAPSE REMAINING ACCORDIANS OTHER THAN CLICKED ONE **/
    this.viewPanels.forEach(element => {
      if (element.id !== 'cdk-accordion-child-' + id) {
        if (value) {
          element.open();
        } else {
          element.close();
        }
      }
    });
  }
  /** END OF FUNCTIONS TO COLLAPSE LEFT MENU **/
}
