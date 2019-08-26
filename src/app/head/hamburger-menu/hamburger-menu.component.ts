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
  AfterViewChecked,
  Input,
  Inject
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
import { FilterExpandService } from '../../shared/filter-expand.service';
import { DOCUMENT, Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { EventEmitterService } from 'src/app/shared/know-your-provider/event-emitter.service';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HamburgerMenuComponent implements AfterViewInit, OnInit, OnDestroy, AfterViewChecked {
  _allExpandState = false;
  loading = false;
  isDarkTheme: Observable<boolean>;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('srnav') srnav: MatSidenav;
  public makeAbsolute: boolean;
  public bgWhite: boolean;
  public sideNavFlag = true;
  subscription: any;
  public glossaryFlag: boolean;
  public glossaryTitle: string = null;
  public glossaryMetricID: string;
  public filterFlag: boolean;
  public filterurl: string = null;
  clickHelpIcon: Subscription;
  clickFilterIcon: Subscription;
  public mobileQuery: boolean;
  public PCORFlag: any;
  public healthSystemName: string;
  public isKop: boolean;
  disableChangeProvider: boolean = environment.internalAccess;
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
        { name: 'Appeals', path: '/GettingReimbursed/Appeals' },
        { name: 'Payment Integrity', path: '/GettingReimbursed/PaymentIntegrity' }
      ]
    },
    {
      icon: 'care-delivery',
      name: 'Care Delivery',
      children: [{ name: 'Prior Authorizations', path: '/CareDelivery/priorAuth' }]
    },
    {
      icon: 'service-interaction',
      name: 'Service Interaction',
      children: [
        { name: 'Self Service', path: '/ServiceInteraction/SelfService' },
        { name: 'Calls', path: '/ServiceInteraction/Calls' }
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
    private filterExpandService: FilterExpandService,
    private priorAuthShared: PriorAuthSharedService,
    private location: Location,
    private eventEmitter: EventEmitterService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.glossaryFlag = false;
    this.filterFlag = false;
    // to disable the header/footer/body when not authenticated
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.makeAbsolute = !(
          authService.isLoggedIn() &&
          !(
            event.url === '' ||
            event.url === '/ProviderSearch' ||
            event.url.includes('print-') ||
            event.url.indexOf('/login') >= 0
          )
        );
        this.bgWhite = !(authService.isLoggedIn() && !event.url.includes('print-'));
        this.loading = true;
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
      'service-interaction',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-stars-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'sign-out',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-input-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'closeGlossary',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'closeFilter',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-search-24px.svg')
    );
  }
  ngOnInit() {
    this.isKop = false;
    this.loading = false;
    this.PCORFlag = false;
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.healthSystemName = JSON.parse(sessionStorage.getItem('currentUser'))[0]['HealthCareOrganizationName'];
    });
    //   console.log(sessionStorage.getItem('currentUser'))
    //   if (sessionStorage.getItem('currentUser')) {
    this.eventEmitter.getEvent().subscribe(val => {
      this.isKop = val.value;
    });

    this.priorAuthShared.getPCORData().then(data => {
      if (this.PCORFlag === data) {
        // Do nothing because its the same state
      } else {
        // Flag changed
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
          if (this.location.path() === '/CareDelivery/PatientCareOpportunity') {
            this.router.navigateByUrl('/OverviewPage');
            this.togglePanels(false, NaN);
          }
          this.PCORFlag = data;
        }
      }
    });

    this.checkStorage.getNavChangeEmitter().subscribe(() => {
      this.priorAuthShared.getPCORData().then(data => {
        if (this.PCORFlag === data) {
          // Do nothing because its the same state
        } else {
          // Flag changed
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
            if (this.location.path() === '/CareDelivery/PatientCareOpportunity') {
              this.router.navigateByUrl('/OverviewPage');
              this.togglePanels(false, NaN);
            }
            this.PCORFlag = data;
          }
        }
      });
    });
    //   }

    this.clickHelpIcon = this.glossaryExpandService.message.subscribe(
      data => {
        this.glossaryFlag = true;
        this.glossaryTitle = data.value;
        this.glossaryMetricID = data.MetricID;
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );

    this.clickFilterIcon = this.filterExpandService.url.subscribe(
      data => {
        this.filterFlag = true;
        this.filterurl = data;
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );
    setTimeout(() => {
      const user = JSON.parse(sessionStorage.getItem('currentUser'));
      if (user) {
        this.healthSystemName =
          user && user[0].hasOwnProperty('HealthCareOrganizationName')
            ? user[0]['HealthCareOrganizationName']
            : user[0]['Healthcareorganizationname'];
      }
    }, 1);
  }

  ngOnDestroy() {
    this.clickHelpIcon.unsubscribe();
    this.glossaryFlag = false;
    this.glossaryTitle = null;
    this.filterFlag = false;
    this.filterurl = null;
    this.clickFilterIcon.unsubscribe();
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
      this.renderer.setStyle(listItem, 'padding', '8px 12px 8px 16px');
      this.renderer.setStyle(listItem, 'width', 'auto');
      if (!listItem.classList.contains('nav-no-child-category')) {
        this.renderer.setStyle(listItem, 'marginLeft', '26px');
      } else {
        this.renderer.setStyle(listItem, 'marginLeft', 0);
      }
    });
    Array.from(listItemBody).forEach(listItem => {
      this.renderer.setStyle(listItem, 'padding', '0px');
    });
  }
  ngAfterViewChecked() {
    // console.log(this.elementRef.nativeElement.querySelectorAll('*[href="/CareDelivery/PatientCareOpportunity"]'));
    try {
      const PCORNavMenu = this.elementRef.nativeElement.querySelectorAll(
        '*[href="/CareDelivery/PatientCareOpportunity"]'
      )[0];
      PCORNavMenu.style.height = 'auto';
      PCORNavMenu.style.padding = '8px 5px 8px 0';
      PCORNavMenu.style.width = 'auto';
      PCORNavMenu.style.marginLeft = '26px';
    } catch (error) {}
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
    window.scrollTo(300, 0);
    // this.allExpandState(false, id - 1);
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
  filterFlagChange(flag) {
    this.filterFlag = flag;
    this.filterurl = null;
  }
  closeFilter() {
    this.filterFlag = false;
    this.filterurl = null;
  }

  // selectProvider(): void {
  //   const dialogRef = this.dialog.open(ProviderSearchComponent, {
  //     width: '550px',
  //     height: '212px',
  //     disableClose: true
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.router.navigateByUrl('/KnowYourProvider');
  //   });
  // }

  signOut() {
    this.authService.logout();
    if (!environment.internalAccess) {
      this.document.location.href = environment.apiUrls.linkLoginPage;
    }
  }
  public close() {
    if (this.filterFlag) {
      this.filterFlag = false;
    }
    if (this.glossaryFlag) {
      this.glossaryFlag = false;
    }
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
