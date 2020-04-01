import {
  Component,
  AfterViewInit,
  OnInit,
  ElementRef,
  Renderer2,
  ViewEncapsulation,
  ViewChildren,
  ViewChild,
  QueryList,
  OnDestroy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { MatExpansionPanel, MatDialog, MatSidenav, MatDialogConfig } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { ViewportScroller } from '@angular/common';
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
import { CheckHcoRlpService } from '../../shared/performance/check-hco-rlp.service';
import { RESET_KOP_FILTER } from 'src/app/store/kopFilter/actions';
import { NgRedux } from '@angular-redux/store';
import { GroupPremiumDesignationService } from '../../rest/group-premium-designation/group-premium-designation.service';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.component.html',
  styleUrls: ['./hamburger-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HamburgerMenuComponent implements AfterViewInit, OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  _allExpandState = false;
  loading = false;
  isDarkTheme: Observable<boolean>;
  @ViewChildren(MatExpansionPanel) viewPanels: QueryList<MatExpansionPanel>;
  @ViewChild('srnav') srnav: MatSidenav;
  GroupPremiumDesignation: any;
  healthSystemData: any;
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
  public isAdvocateHome: boolean;
  disableChangeProvider: boolean = environment.internalAccess;
  internalUser: boolean = environment.internalAccess;
  externalProvidersCount = false;
  public checkAdv;
  public checkPro;
  public checkExecutive;
  printStyle: boolean;
  public isPerformance: boolean;
  /*** Array of Navigation Category List ***/
  public navCategories = [];
  public navCategoriesTotal = [
    { icon: 'home', name: 'Overview', path: '/NationalExecutive', disabled: false, kop: true },
    { icon: 'summary', name: 'NPS Summary', path: '/NationalExecutive/NpsDetail', disabled: false, kop: true },
    // {
    //   icon: 'person',
    //   name: 'Onboarding',
    //   children: [{ name: 'Summary', path: '/NationalExecutive/Onboarding/Summary', kop: true }],
    //   disabled: false,
    //   kop: true
    // },
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
      ],
      disabled: false
    },
    // {
    //   icon: 'care-delivery',
    //   name: 'Care Delivery',
    //   children: [{ name: 'Prior Authorizations', path: '/CareDelivery/priorAuth' }]
    // },
    { icon: 'prior-auth', name: 'Prior Authorizations', path: '/CareDelivery/priorAuth', disabled: false },
    {
      icon: 'pcor',
      name: 'Patient Care Opportunity ',
      path: '/CareDelivery/PatientCareOpportunity',
      disabled: true
    },
    {
      icon: 'service-interaction',
      name: 'Service Interaction',
      children: [
        { name: 'Self Service', path: '/ServiceInteraction/SelfService' },
        { name: 'Calls', path: '/ServiceInteraction/Calls' }
      ],
      disabled: false
    },
    {
      icon: 'timeline',
      name: 'Summary Trends',
      path: '/AdminSummaryTrends',
      disabled: true
    },
    {
      icon: 'performance',
      name: 'Performance',
      children: [
        { name: 'Summary', path: '/Performance', disabled: false },
        { name: 'Referrals', path: '/Performance/Referrals', disabled: false },
        { name: 'Labs', path: '/Performance/Labs', disabled: false },
        { name: 'Prescriptions', path: '/Performance/Prescriptions', disabled: false }
      ],
      disabled: false
    }
  ];
  fillerNav = Array.from({ length: 50 }, (_, i) => `Nav Item ${i + 1}`);
  filterData: any[] = [];
  customFilter = false;
  fromKOP = false;
  advocateView = false;

  /** CONSTRUCTOR **/
  constructor(
    public groupPremiumDesignationService: GroupPremiumDesignationService,
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
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
    private viewPortScroller: ViewportScroller,
    private checkRlpService: CheckHcoRlpService,
    private ngRedux: NgRedux<any>,
    @Inject(DOCUMENT) private document: any
  ) {
    this.glossaryFlag = false;
    this.filterFlag = false;
    this.bgWhite = false;
    this.showPrintHeader = false;
    this.fromKOP = false;
    this.advocateView = false;
    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();
    this.checkExecutive = this.sessionService.checkExecutiveRole();
    if (this.checkAdv.value) {
      this.navCategories = this.navCategoriesTotal.filter(item => item.name !== 'Summary Trends');
      sessionStorage.setItem('advocateView', 'true');
    }
    // Group Premium Designation
    if (this.groupPremiumDesignationService.groupPremiumDesignationData() && this.internalUser) {
      this.groupPremiumDesignationService.groupPremiumDesignationData().subscribe(response => {
        this.GroupPremiumDesignation = response.HppIndicator;
      });
    }

    // to disable the header/footer/body when not authenticated
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.healthSystemName = this.sessionService.getHealthCareOrgName();
        if (this.groupPremiumDesignationService.groupPremiumDesignationData() && this.internalUser) {
          this.groupPremiumDesignationService.groupPremiumDesignationData().subscribe(response => {
            this.GroupPremiumDesignation = response.HppIndicator;
          });
        }
        this.makeAbsolute = !(
          authService.isLoggedIn() &&
          !(
            event.url === '' ||
            event.url === '/ProviderSearch' ||
            event.url.includes('print-') ||
            event.url.indexOf('/login') >= 0 ||
            event.url === '/AccessDenied'
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
          if (window.location.pathname === '/OverviewPage' && !event.url.includes('print-')) {
            window.location.href = '/OverviewPageAdvocate';
          }
        }
        // this.checkPcorData();
        if (this.sessionService.isPCORData()) {
          this.insertPCORnav();
        }

        /*
         * Check Rlp Data from session storage, This is written to tackle the page refresh thing.
         * As after page refresh application is losing the state whether Performance exist on left nav or not
         * So to keep track of that we stored value in the session storage.
         */
        if (this.sessionService.isRlpData() && this.internalUser) {
          this.insertRlpNav(this.sessionService.isRlpData());
        } else {
          console.log('No Data at Session Storage for Rlp');
        }

        // If the environment is not Internal then disable the Rlp
        if (!this.internalUser) {
          const isRlpDisable = {
            All: true,
            Referral: true,
            Labs: true,
            Perscription: true
          };
          this.insertRlpNav(isRlpDisable);
          if (event.url.includes('Performance')) {
            this.router.navigate(['/OverviewPage']);
          }
        }

        // Check condtion for rendering butter bar
        if (
          (sessionStorage.getItem('fromKOP') === 'YES' &&
            !this.makeAbsolute &&
            !event.url.includes('NationalExecutive') &&
            this.checkPro.value) ||
          this.checkExecutive.value
        ) {
          this.fromKOP = true;
        } else {
          this.fromKOP = false;
        }

        // Check the advocate page
        if (
          sessionStorage.getItem('advocateView') === 'true' &&
          !this.makeAbsolute &&
          event.url !== '/OverviewPageAdvocate' &&
          event.url !== '/OverviewPageAdvocate/Home' &&
          this.checkAdv.value
        ) {
          this.advocateView = true;
        } else {
          this.advocateView = false;
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
      'summary',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/bar_chart-24px.svg')
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
    iconRegistry.addSvgIcon('prior-auth', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/PA-idle.svg'));
    iconRegistry.addSvgIcon('pcor', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/PCOR.svg'));
    iconRegistry.addSvgIcon(
      'person',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-person-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'performance',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/performance-icon.svg')
    );

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (event.url.includes('/Home')) {
          this.isAdvocateHome = true;
          this.sideNavFlag = false;
        }
        this.printStyle = event.url.includes('print-');
      }
    });
  }

  ngOnInit() {
    this.AcoFlag = false;
    this.isKop = false;
    this.isAdvocateHome = false;
    this.loading = false;
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.acoEventEmitter.getEvent().subscribe(value => {
      this.AcoFlag = value.value;
    });
    this.navCategories = this.navCategoriesTotal.filter(item => !item.kop);
    this.eventEmitter.getEvent().subscribe(val => {
      this.isKop = val.value;
      this.navCategories = this.navCategoriesTotal.filter(item => item.kop);
      this.cdRef.detectChanges();
    });
    this.checkStorage.getEvent().subscribe(value => {
      if (value.value === 'overviewPage') {
        this.healthSystemName = this.sessionService.getHealthCareOrgName();
      }
      // Check whether we have PCOR Data or not, if yes then include the PCOR option in navigation bar
      this.checkPcorData();

      // If the environment is internal then checkRlp Data otherwise disable it from left navigation
      if (this.internalUser) {
        this.checkRlpData();
      } else {
        const isRlpDisable = {
          All: true,
          Referral: true,
          Labs: true,
          Perscription: true
        };
        this.insertRlpNav(isRlpDisable);
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
        setTimeout(() => {
          this.viewPortScroller.scrollToPosition([0, 0]);
        }, 500);
        this.stopBodyScroll(true);
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
        setTimeout(() => {
          this.viewPortScroller.scrollToPosition([0, 0]);
        }, 500);
        this.stopBodyScroll(true);
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
          this.stopBodyScroll(true);
        }
      },
      err => {
        console.log('Error, clickHelpIcon , inside Hamburger', err);
      }
    );
    setTimeout(() => {
      this.healthSystemName = this.sessionService.getHealthCareOrgName();
    }, 1);

    const currentUser: any = JSON.parse(sessionStorage.getItem('currentUser'))[0];
    if (currentUser.hasOwnProperty('Providers')) {
      this.externalProvidersCount = currentUser.Providers.length > 1 ? true : false;
    }
  }

  advocateRole() {
    this.sessionService.checkAdvocateRole();
    this.navCategories[0].path = '/OverviewPageAdvocate';
  }

  /* To check whether we have data for the PCOR or not, if we don't have data for PCOR then in the navigation
   bar PCOR will be hidden
   */
  insertPCORnav() {
    if (!this.navCategories.some(i => i.name === 'Patient Care Opportunity')) {
      this.navCategories[3].disabled = false;
    }
  }
  removePCORnav() {
    this.navCategories[3].disabled = true;
  }
  checkToggle(bool: boolean) {
    return bool ? this.sessionService.checkTrendAccess() && environment.internalAccess : !bool;
  }

  insertRlpNav(isRlpDisable) {
    const getIndex: number = this.navCategories.findIndex(item => item.name === 'Performance');
    this.navCategories[getIndex].children[0].disabled = isRlpDisable.All;
    this.navCategories[getIndex].children[1].disabled = isRlpDisable.Referral;
    this.navCategories[getIndex].children[2].disabled = isRlpDisable.Labs;
    this.navCategories[getIndex].children[3].disabled = isRlpDisable.Perscription;
    this.navCategories[getIndex].disabled = isRlpDisable.All;
  }
  checkRlpRoute(isRlpDisable, page: string) {
    sessionStorage.removeItem('rlp');
    this.insertRlpNav(isRlpDisable);
    sessionStorage.setItem('rlp', JSON.stringify(isRlpDisable));
    this.isPerformance = isRlpDisable.All ? true : false;
    if (this.router.url.includes(page)) {
      this.router.navigate(['/OverviewPage']);
    }
  }
  checkRlpData() {
    this.checkRlpService.checkRlpHCO(this.sessionService.providerKeyData()).then(response => {
      const isRlpDisable = {
        All: false,
        Referral: false,
        Labs: false,
        Perscription: false
      };
      const getIndex: number = this.navCategories.findIndex(item => item.name === 'Performance');

      if (getIndex !== -1) {
        if (response[0] && response[1] && response[2]) {
          isRlpDisable.All = false;
          isRlpDisable.Referral = false;
          isRlpDisable.Labs = false;
          isRlpDisable.Perscription = false;
          this.checkRlpRoute(isRlpDisable, 'AllWell');
        } else {
          if (!response[0] && !response[1] && !response[2]) {
            isRlpDisable.All = true;
            isRlpDisable.Referral = true;
            isRlpDisable.Labs = true;
            isRlpDisable.Perscription = true;
            this.checkRlpRoute(isRlpDisable, 'Performance');
          } else {
            if (!response[0]) {
              isRlpDisable.Referral = true;
              this.checkRlpRoute(isRlpDisable, 'Referral');
            }
            if (!response[1]) {
              isRlpDisable.Labs = true;
              this.checkRlpRoute(isRlpDisable, 'Labs');
            }
            if (!response[2]) {
              isRlpDisable.Perscription = true;
              this.checkRlpRoute(isRlpDisable, 'Perscription');
            }
          } // end if else of negative cases
        } // end if of Positive vs negative cases
      } // end if of getIndex -1
    });
  }
  checkPcorData() {
    const parametersExecutive = [this.sessionService.providerKeyData(), true];
    this.pcorService.getExecutiveData(...parametersExecutive).subscribe(
      data => {
        const PCORData = data.PatientCareOpportunity;
        if (PCORData === null || PCORData === undefined) {
          try {
            this.removePCORnav();
            sessionStorage.removeItem('pcor');
            // this.navCategories[2].children = this.navCategories[2].children.filter(
            //   i => i.name !== 'Patient Care Opportunity'
            // );
            if (this.router.url.includes('CareDelivery/PatientCareOpportunity')) {
              // Role based access for Advocates Overview page
              if (this.checkAdv.value) {
                this.router.navigate(['/OverviewPageAdvocate']);
              } else if (this.checkPro.value) {
                this.router.navigate(['/OverviewPage']);
              }
            }
          } catch (err) {
            this.removePCORnav();
          }
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
    this.checkRlpService.uncheckRlpHCO();
    sessionStorage.removeItem('fromKOP');
    this.fromKOP = false;
    sessionStorage.removeItem('advocateView');
    this.advocateView = false;
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

  hamburgerDisplay(input: boolean) {
    this.sideNavFlag = input;
    // alert(this.sideNavFlag);
  }

  toggleDarkTheme(isDarkTheme: boolean) {
    this.themeService.setDarkTheme(isDarkTheme);
  }
  /** FUNCTIONS TO COLLAPSE LEFT MENU **/
  collapseExpansionPanels(path) {
    window.scrollTo(300, 0);
    this.allExpandState(false, path);
  }

  openDialog(): void {
    this.dialog.open(ProviderSearchComponent, {
      width: '550px',
      height: '212px',
      disableClose: true
    });
    sessionStorage.setItem('advocateView', 'true');
  }

  closeGlossary() {
    this.glossaryFlag = false;
    this.glossaryTitle = null;
    this.stopBodyScroll(false);
  }
  filterFlagChange(flag) {
    this.filterFlag = flag;
    this.filterurl = null;
    this.stopBodyScroll(false);
  }
  closeFilter() {
    this.filterFlag = false;
    this.filterurl = null;
    this.stopBodyScroll(false);
  }

  stopBodyScroll(flag: boolean) {
    document.body.style.overflow = flag ? 'hidden' : 'auto';
  }

  signOut() {
    this.authService.logout();
    if (!environment.internalAccess) {
      this.document.location.href = environment.apiUrls.SsoLogoutUrl;
    }
  }
  public close() {
    if (this.filterFlag) {
      this.filterFlag = false;
    }
    if (this.glossaryFlag) {
      this.glossaryFlag = false;
    }
    this.stopBodyScroll(false);
  }

  /**
   * Reset fromKOP flag,false
   * and Remvoe fromKOP
   */
  closeButterBar() {
    this.fromKOP = false;
    sessionStorage.removeItem('fromKOP');
    this.advocateView = false;
    sessionStorage.removeItem('advocateView');
  }

  /**
   * Navigate Back to KOP,
   * Clean fromKOP storage
   */
  navigateToKOP() {
    sessionStorage.removeItem('fromKOP');
    this.fromKOP = false;
    this.router.navigate(['/NationalExecutive']);
  }

  taxSummaryLink() {
    if (this.sessionService.checkRole('UHCI_Advocate')) {
      this.router.navigateByUrl('/OverviewPageAdvocate/Home');
    } else {
      this.router.navigateByUrl('/TinList');
    }
  }

  navigateToPPD() {
    setTimeout(() => {
      sessionStorage.removeItem('advocateView');
      this.advocateView = false;
    }, 500);
    location.href = '/OverviewPageAdvocate';
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
        sessionStorage.setItem('advocateView', 'true');
        sessionStorage.removeItem('kopFilterState');
        this.ngRedux.dispatch({ type: RESET_KOP_FILTER });
        // Reloading targeted route, for resetting the css
        window.location.href = '/OverviewPage';
      },
      containerLabel: 'View as an Organization'
    };

    // Set Styling
    dialogConfig.width = '550px';
    dialogConfig.height = '212px';
    dialogConfig.disableClose = true;

    // Call the dialog open method
    this.dialog.open(ProviderSearchComponent, dialogConfig);
  }

  private allExpandState(value: boolean, path) {
    // this._allExpandState = value;
    this.togglePanels(value, path);
  }

  private togglePanels(value: boolean, path) {
    // this.viewPanels.forEach(p => value ? p.open() : p.close());

    /** USED TO COLLAPSE REMAINING ACCORDIANS OTHER THAN CLICKED ONE **/
    this.viewPanels.forEach(element => {
      if (
        path === '/GettingReimbursed' ||
        path === '/GettingReimbursed/Payments' ||
        path === '/GettingReimbursed/NonPayments' ||
        path === '/GettingReimbursed/Appeals'
      ) {
        if (element.id === 'cdk-accordion-child-0') {
          element.open();
        } else {
          element.close();
        }
      } else if (path === '/GettingReimbursed/PaymentIntegrity') {
        if (element.id === 'cdk-accordion-child-0' || element.id === 'cdk-accordion-child-1') {
          element.open();
        } else {
          element.close();
        }
      } else if (path === '/ServiceInteraction/SelfService' || path === '/ServiceInteraction/Calls') {
        if (element.id === 'cdk-accordion-child-2') {
          element.open();
        } else {
          element.close();
        }
      } else if (
        path === '/Performance' ||
        path === '/Performance/Referrals' ||
        path === '/Performance/Labs' ||
        path === '/Performance/Prescriptions'
      ) {
        if (element.id === 'cdk-accordion-child-3') {
          element.open();
        } else {
          element.close();
        }
      } else {
        element.close();
      }
    });
  }

  /** END OF FUNCTIONS TO COLLAPSE LEFT MENU **/
}
