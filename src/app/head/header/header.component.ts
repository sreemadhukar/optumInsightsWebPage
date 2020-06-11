// author: madhukar
// date: 4-15-2019
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  Inject
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { Observable, Subscription } from 'rxjs';
import { StorageService } from '../../shared/storage-service.service';
import { EventEmitterService } from '../../shared/know-our-provider/event-emitter.service';
import { SessionService } from '../../shared/session.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../auth/_service/authentication.service';

interface IClicked {
  myView: boolean;
  provider: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('scrollAnimation', [
      state(
        'show',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      state(
        'hide',
        style({
          opacity: 0,
          transform: 'translateY(-100%)'
        })
      ),
      transition('show => hide', animate('200ms ease-out')),
      transition('hide => show', animate('200ms ease-in'))
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isInternal: boolean = environment.internalAccess;
  @Input() isDarkTheme: Observable<boolean>;
  @Input() button: boolean;
  @Input() fromKOP: boolean;
  public isKop: boolean;
  @Output() hamburgerDisplay = new EventEmitter<boolean>();
  @Output() clickOutside = new EventEmitter<boolean>();
  public sideNavFlag = false;
  public state: any;
  public mobileQuery: boolean;
  public menuIcon = 'menu';
  public username = '';
  public advDropdownBool = false;
  subscription: Subscription;
  public healthSystemName: string;
  public checkAdv;
  public checkPro;
  printStyle: boolean;
  printRoute: string;
  today = new Date();
  todaysDataTime = '';
  public fullname = '';
  public MsId = '';
  public OptumId = '';
  public EmailId = '';
  public openDropdownBool = false;
  public checkedClicked: IClicked;
  public myView;
  public userView;
  public isAdvocate;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public el: ElementRef,
    private iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer,
    private themeService: ThemeService,
    private router: Router,
    private checkStorage: StorageService,
    private eventEmitter: EventEmitterService,
    private sessionService: SessionService,
    @Inject(DOCUMENT) private document: any,
    private authService: AuthenticationService
  ) {
    // to fetch the date and time
    const d = new Date();
    this.todaysDataTime = d.toLocaleString().replace(',', '');

    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
          const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
          this.username = userInfo.FirstName;
          this.fullname = userInfo.FirstName + ' ' + userInfo.LastName;
          this.MsId = userInfo.MsId;
          this.OptumId = userInfo.OptumId;
          this.EmailId = userInfo.EmailId;
        }
        this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1279px)');

        if (!this.mobileQuery) {
          this.sideNavFlag = true;
          this.menuIcon = 'cross';
          this.hamburgerDisplay.emit(this.sideNavFlag);
        } else {
          this.sideNavFlag = false;
          this.menuIcon = 'menu';
          this.hamburgerDisplay.emit(this.sideNavFlag);
        }
      }
      // PLEASE DON'T MODIFY THIS
    });

    this.iconRegistry.addSvgIcon(
      'person',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-person-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'expand-more',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-expand_more-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-menu-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'cross',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-clear-24px.svg')
    );
    this.iconRegistry.addSvgIcon(
      'done',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-done-24px.svg')
    );

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.printStyle = event.url.includes('print-');
      }
    });
  }

  toggler() {
    this.openDropdownBool = !this.openDropdownBool;
  }

  advocateUserClicked() {
    if (this.sessionService.checkRole('UHCI_Advocate')) {
      this.advDropdownBool = true;
    } else {
      this.advDropdownBool = false;
    }
    this.toggler();
  }

  advViewClicked(value: string) {
    if (value === 'myView') {
      this.myView = true;
      this.userView = false;
      sessionStorage.setItem('advocateView', 'false');
      this.router.navigate(['/OverviewPageAdvocate']);
    } else if (value === 'userView') {
      this.userView = true;
      this.myView = false;
      sessionStorage.setItem('advocateView', 'true');
      this.router.navigate(['/OverviewPage']);
    }
    this.openDropdownBool = false;
  }

  @HostListener('document:click', ['$event.target'])
  advocateUserClick() {}

  ngOnInit() {
    this.myView = true;
    this.userView = false;

    this.isAdvocate = this.sessionService.checkRole('UHCI_Advocate');
    this.advDropdownBool = false;
    this.healthSystemName = this.sessionService.getHealthCareOrgName();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.eventEmitter.getEvent().subscribe(val => {
      this.isKop = val.value;
      if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
        const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
        this.username = userInfo.FirstName;
        this.fullname = userInfo.FirstName + ' ' + userInfo.LastName;
        this.MsId = userInfo.MsId;
        this.OptumId = userInfo.OptumId;
        this.EmailId = userInfo.EmailId;
      }
    });

    this.checkStorage.getEvent().subscribe(value => {
      if (value.value === 'overviewPage') {
        if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
          const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
          this.username = userInfo.FirstName;
          this.fullname = userInfo.FirstName + ' ' + userInfo.LastName;
          this.MsId = userInfo.MsId;
          this.OptumId = userInfo.OptumId;
          this.EmailId = userInfo.EmailId;
        }
      }
    });
  }
  /*angular theme */

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }
  /*angular theme */

  onLogoClick() {
    const isAdvocate = this.sessionService.checkRole('UHCI_Advocate');
    const isExecutive = this.sessionService.checkRole('UHCI_Executive');
    const isProjectUser = this.sessionService.checkRole('UHCI_Project');

    if (this.isInternal) {
      if (isAdvocate) {
        this.router.navigate(['/OverviewPageAdvocate']);
      } else if (isExecutive || isProjectUser) {
        if (this.isKop) {
          this.router.navigate(['/NationalExecutive']);
        } else {
          this.router.navigate(['/OverviewPage']);
        }
      }
    } else {
      // For External Business
      this.router.navigate(['/OverviewPage']);
    }
  }

  sidenav() {
    this.sideNavFlag = !this.sideNavFlag;
    this.hamburgerDisplay.emit(this.sideNavFlag);

    if (this.sideNavFlag) {
      this.menuIcon = 'cross';
    } else {
      this.menuIcon = 'menu';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1279px)');

    if (!this.mobileQuery) {
      this.sideNavFlag = true;
      this.hamburgerDisplay.emit(this.sideNavFlag);
    } else {
      this.sideNavFlag = false;
      this.menuIcon = 'menu';
      this.hamburgerDisplay.emit(this.sideNavFlag);
    }
  }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop + 10;
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < componentPosition) {
      this.state = 'show';
    } else {
      this.state = 'show';
    }
  }

  signOut() {
    this.openDropdownBool = false;
    this.authService.logout();
    if (!environment.internalAccess) {
      this.document.location.href = environment.apiUrls.SsoLogoutUrl;
    }
  }

  closeDropdown() {
    this.openDropdownBool = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
