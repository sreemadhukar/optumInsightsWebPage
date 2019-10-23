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
import { MatExpansionPanel, MatDialog, MatSidenav, MatDialogConfig } from '@angular/material';
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
import { FilterExpandService } from '../../shared/filter-expand.service';
import { DOCUMENT, Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { SessionService } from '../../shared/session.service';
import { AcoEventEmitterService } from '../../shared/ACO/aco-event-emitter.service';
import { FilterCloseService } from './../../shared/filters/filter-close.service';
import { PcorService } from '../../rest/care-delivery/pcor.service';
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
  public showPrintHeader: boolean;
  public sideNavFlag = true;
  public AcoFlag: boolean;
  subscription: any;
  public glossaryFlag: boolean;
  public glossaryTitle: string = null;
  public glossaryMetricID: string;
  public filterFlag: boolean;
  public filterurl: string = null;
  clickHelpIcon: Subscription;
  clickFilterIcon: Subscription;
  clickFilterIconCustom: Subscription;
  filterClose: Subscription;
  public mobileQuery: boolean;
  public healthSystemName: string;
  public isKop: boolean;
  disableChangeProvider: boolean = environment.internalAccess;
  public checkAdv;
  public checkPro;
  public checkExecutive;
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
        // { name: 'Payment Integrity', path: '/GettingReimbursed/PaymentIntegrity' }
        {
          name: 'Payment Integrity',
          children: [
            { name: 'Medical Records Coding Review', path: '/GettingReimbursed/PaymentIntegrity' }
            // Uncomment Next Line when data is available for Smart Edits
            // { name: 'Smart Edits', path: '/GettingReimbursed/SmartEdits' }
          ]
        }
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
    },
    {
      icon: 'timeline',
      name: 'Summary Trends',
      path: '/AdminSummaryTrends',
      disabled: true
    }
  ];
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  filterData: any[] = [];
  customFilter = false;
  fromKOP = false;

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
    private filterCloseService: FilterCloseService,
    private pcorService: PcorService,
    private location: Location,
    public sessionService: SessionService,
    private eventEmitter: EventEmitterService,
    private acoEventEmitter: AcoEventEmitterService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.glossaryFlag = false;
    this.filterFlag = false;
    this.bgWhite = false;
    this.showPrintHeader = false;
    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();
    this.checkExecutive = this.sessionService.checkExecutiveRole();
    if (this.checkAdv.value) {
      this.navCategories = this.navCategories.filter(item => item.name !== 'Summary Trends');
    }
    // to disable the header/footer/body when not authenticated
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.healthSystemName = this.sessionService.getHealthCareOrgName();
        this.makeAbsolute = !(
          authService.isLoggedIn() &&
          !(
            event.url === '' ||
            event.url === '/ProviderSearch' ||
            event.url.includes('print-') ||
            event.url.indexOf('/login') >= 0
          )
        );
        /*
        for login, providerSearch screen , filters has no role to play, so for them Filters should be close,
         we are calling it explicity because suppose user clicks on Filter and filter drawer opens up, now logout
         occures, user will land to the login screen with filter drawer opened, so that is the issue,
         To tackle that we have service which we imported at app.component so when user's timesout it will publish the
         the value, which we subscribed using Subject 'filterClose'.

         For consider any further cases , i have writter following if condition as well.
         */

        if (this.makeAbsolute) {
          this.closeGlossary();
          this.filterFlagChange(false);
        }
        this.bgWhite = !(authService.isLoggedIn() && !event.url.includes('print-'));
        this.showPrintHeader = event.url.includes('print-');
        this.loading = true;
        // Role based access for Advocates Overview page
        if (this.checkAdv.value) {
          this.navCategories[0].path = '/OverviewPageAdvocate';
          if (window.location.pathname === '/OverviewPage') {
            window.location.href = '/OverviewPageAdvocate';
          }
        } else if (this.checkPro.Value) {
          if (window.location.pathname === '/OverviewPageAdvocate') {
            window.location.href = '/OverviewPage';
          }
        } else if (this.checkExecutive.Value) {
          this.navCategories[0].path = '/NationalExecutive';
          if (window.location.pathname === '/OverviewPage' || window.location.pathname === '/ProviderSearch') {
            window.location.href = '/NationalExecutive';
          }
        }
        // this.checkPcorData();
        if (this.sessionService.isPCORData()) {
          this.insertPCORnav();
        }
        const heac = JSON.parse(sessionStorage.getItem('heac'));
        if (event.url === '/NationalExecutive' && !heac.heac) {
          router.navigate(['/ProviderSearch']);
        }

        // Check condtion for rendering butter bar
        if (sessionStorage.getItem('fromKOP') === 'YES' && !this.makeAbsolute && event.url !== '/NationalExecutive') {
          setTimeout(() => {
            this.fromKOP = true;
          }, 500);
        } else {
          this.fromKOP = false;
          sessionStorage.removeItem('fromKOP');
        }
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
    iconRegistry.addSvgIcon(
      'timeline',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/timeline-24px.svg')
    );
  }

  ngOnInit() {
    this.AcoFlag = false;
    this.isKop = false;
    this.loading = false;
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.acoEventEmitter.getEvent().subscribe(value => {
      this.AcoFlag = value.value;
    });
    this.eventEmitter.getEvent().subscribe(val => {
      this.isKop = val.value;
    });
    this.checkStorage.getEvent().subscribe(value => {
      if (value.value === 'overviewPage') {
        this.healthSystemName = this.sessionService.getHealthCareOrgName();
        // Check whether we have PCOR Data or not, if yes then include the PCOR option in navigation bar
        this.checkPcorData();
      }
    });
    /*
        for login page filters has no role to play, so for them Filters should be close,
         we are calling it explicity because suppose user clicks on Filter and filter drawer opens up, now logout
         occures, user will land to the login screen with filter drawer opened, so that is the issue,
         To tackle that we have service which we imported at app.component so when user's timesout it will publish the
         the value, which we subscribed using Subject 'filterClose'.
    */
    this.filterClose = this.filterCloseService.filterClose.subscribe(
      boolData => {
        this.closeGlossary();
        this.filterFlagChange(boolData);
      },
      err => {
        console.log('Error, filterclose on timeout , inside Hamburger', err);
      }
    );

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
        this.customFilter = false;
        this.filterurl = data;
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );
    this.clickFilterIconCustom = this.filterExpandService.filterData.subscribe(
      data => {
        this.filterFlag = true;
        if (data) {
          const { filterData = [], customFilter, url } = data;
          this.filterData = filterData;
          this.customFilter = customFilter;
          this.filterurl = url;
        }
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );
    setTimeout(() => {
      this.healthSystemName = this.sessionService.getHealthCareOrgName();
    }, 1);
  }

  advocateRole() {
    this.sessionService.checkAdvocateRole();
    this.navCategories[0].path = '/OverviewPageAdvocate';
  }

  /* To check whether we have data for the PCOR or not, if we don't have data for PCOR then in the navigation
  bar PCOR will be hidden
  */
  insertPCORnav() {
    if (!this.navCategories[2].children.some(i => i.name === 'Patient Care Opportunity')) {
      this.navCategories[2].children.push({
        name: 'Patient Care Opportunity',
        path: '/CareDelivery/PatientCareOpportunity'
      });
    }
  }
  checkToggle(bool: boolean) {
    return bool ? this.sessionService.checkTrendAccess() && environment.internalAccess : !bool;
  }
  checkPcorData() {
    const parametersExecutive = [this.sessionService.providerKeyData(), true];
    this.pcorService.getExecutiveData(...parametersExecutive).subscribe(
      data => {
        const PCORData = data.PatientCareOpportunity;
        if (PCORData === null) {
          try {
            sessionStorage.removeItem('pcor');
            this.navCategories[2].children = this.navCategories[2].children.filter(
              i => i.name !== 'Patient Care Opportunity'
            );
            if (this.router.url.includes('CareDelivery/PatientCareOpportunity')) {
              // Role based access for Advocates Overview page
              if (this.checkAdv.value) {
                this.router.navigate(['/OverviewPageAdvocate']);
              } else if (this.checkPro.value) {
                this.router.navigate(['/OverviewPage']);
              }
            }
          } catch (err) {}
        } else {
          const temp = { isPCOR: true };
          sessionStorage.setItem('pcor', JSON.stringify(temp));
          this.insertPCORnav();
        }
      },
      err => {
        console.log('check for PCOR data Error', err);
      }
    );
  }

  ngOnDestroy() {
    this.clickHelpIcon.unsubscribe();
    this.glossaryFlag = false;
    this.glossaryTitle = null;
    this.filterFlag = false;
    this.filterurl = null;
    this.clickFilterIcon.unsubscribe();
    this.clickFilterIconCustom.unsubscribe();
    sessionStorage.removeItem('fromKOP');
    this.fromKOP = false;
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

  /**
   * Reset fromKOP flag,false
   * and Remvoe fromKOP
   */
  closeButterBar() {
    this.fromKOP = false;
    sessionStorage.removeItem('fromKOP');
  }

  /**
   * Navigate Back to KOP,
   * Clean fromKOP storage
   */
  navigateToKOP() {
    sessionStorage.removeItem('fromKOP');
    this.fromKOP = false;
    window.location.href = '/NationalExecutive';
  }

  /**
   * Open ProviderSearchComponent with setting the,
   * data and after action action
   */
  openSimulateViewDialog(): void {
    const dialogConfig = new MatDialogConfig();

    // Set label for the container label and pass after selection trigger function
    dialogConfig.data = {
      valueSelected: () => {
        // Setting Value redirect, remind flag to local storage
        sessionStorage.setItem('fromKOP', 'YES');

        // Reloading targeted route, for resetting the css
        window.location.href = '/OverviewPage';
      },
      containerLabel: 'View as a Provider'
    };

    // Set Styling
    dialogConfig.width = '550px';
    dialogConfig.height = '212px';
    dialogConfig.disableClose = true;

    // Call the dialog open method
    this.dialog.open(ProviderSearchComponent, dialogConfig);
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
