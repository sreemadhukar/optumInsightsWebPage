// author: madhukar
// date: 4-15-2019
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  OnDestroy,
  Inject
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { formatDate } from '@angular/common';
import { MatExpansionPanel } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
import { ThemeService } from '../../shared/theme.service';
import { Observable, Subscription } from 'rxjs';
import { CommonUtilsService } from '../../shared/common-utils.service';
import { StorageService } from '../../shared/storage-service.service';
import { EventEmitterService } from '../../shared/know-our-provider/event-emitter.service';
import { SessionService } from '../../shared/session.service';
import { DOCUMENT, Location } from '@angular/common';
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
    private renderer: Renderer2,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private themeService: ThemeService,
    private router: Router,
    private utils: CommonUtilsService,
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
    // this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
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
        // alert(this.mobileQuery);
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

    iconRegistry.addSvgIcon(
      'person',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-person-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'expand-more',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-expand_more-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'menu',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-menu-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'cross',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-clear-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'done',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/round-done-24px.svg')
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
    console.log('this.checkAdv()', this.checkAdv.value);
    if (this.sessionService.checkRole('UHCI_Advocate')) {
      this.advDropdownBool = true;
    } else {
      this.advDropdownBool = false;
    }
    this.toggler();
  }

  advViewClicked(value: string) {
    if (value === 'myView') {
      // this.sessionService.checkedClicked.myView = true;
      // this.checkedClicked.myView = this.sessionService.checkedClicked.myView;

      // this.sessionService.checkedClicked.provider = false;
      // this.checkedClicked.provider = this.sessionService.checkedClicked.provider;
      this.myView = true;
      this.userView = false;
      this.router.navigate(['/OverviewPageAdvocate']);
    } else if (value === 'userView') {
      // this.sessionService.checkedClicked.myView = false;
      // this.checkedClicked.myView = this.sessionService.checkedClicked.myView;

      // this.sessionService.checkedClicked.provider = true;
      // this.checkedClicked.provider = this.sessionService.checkedClicked.provider;
      this.userView = true;
      this.myView = false;
      this.router.navigate(['/OverviewPage']);
    }
    this.openDropdownBool = false;
  }

  @HostListener('document:click', ['$event.target'])
  advocateUserClick(targetElement) {
    /*const HeaderElement = document.querySelector('.header-div');
    const ButtonElement = document.querySelector('.user-div');
    const dropdownElement1 = document.querySelector('.vertical-menu');
    const clickedHeader = HeaderElement.contains(targetElement);
    const clickedButton = ButtonElement.contains(targetElement);
    const clickedInside = dropdownElement1.contains(targetElement);
    if (!clickedHeader && !clickedButton && !clickedInside) {
      this.advDropdownBool = false;
      this.clickOutside.emit(null);
    } else if (clickedHeader && !clickedButton && !clickedInside) {
      this.advDropdownBool = false;
      this.clickOutside.emit(null);
    }*/
    /*const dropdownElement = document.querySelector('.vertical-menu');
    const btns = dropdownElement.getElementsByClassName('act');
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function() {
         const current = document.getElementsByClassName('active');
        // if (current.length > 0) {
        //  current[0].className = current[0].className.replace('active', '');
       // }
        // current[0].className = current[0].className.replace('cur', 'active');
        if (this.myView = true) {
          current[1].className = current[1].className.replace('active', '');
        } if (this.userView = true) {
          current[0].className = current[0].className.replace('active', '');
        }
        this.className = 'active';
      });
    }*/
  }

  ngOnInit() {
    // this.sessionService.checkedClicked.myView = true;
    // this.checkedClicked.myView = this.sessionService.checkedClicked.myView;

    // this.sessionService.checkedClicked.provider = false;
    // this.checkedClicked.provider = this.sessionService.checkedClicked.provider;
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
    // alert(this.sideNavFlag);
    if (this.sideNavFlag) {
      this.menuIcon = 'cross';
    } else {
      this.menuIcon = 'menu';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1279px)');
    // alert(this.mobileQuery);
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
