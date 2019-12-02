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
  OnDestroy
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
  @Input() isDarkTheme: Observable<boolean>;
  @Input() button: boolean;
  public isKop: boolean;
  @Output() hamburgerDisplay = new EventEmitter<boolean>();
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
  todayDate: Date;

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
    private sessionService: SessionService
  ) {
    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();
    // this.mobileQuery = this.breakpointObserver.isMatched('(max-width: 1024px)');
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
          const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
          this.username = userInfo.FirstName;
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

    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.printStyle = event.url.includes('print-');
        this.todayDate = new Date();
      }
    });
  }

  advocateUserClick() {
    if (this.checkAdv.value) {
      this.advDropdownBool = !this.advDropdownBool;
    } else {
      this.advDropdownBool = false;
    }
  }
  advViewClicked(value: string) {
    if (value === 'myView') {
      this.router.navigate(['/OverviewPageAdvocate']);
    } else if (value === 'userView') {
      this.router.navigate(['/OverviewPage']);
    }
  }
  ngOnInit() {
    this.advDropdownBool = false;
    this.healthSystemName = this.sessionService.getHealthCareOrgName();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.eventEmitter.getEvent().subscribe(val => {
      this.isKop = val.value;
      if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
        const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
        this.username = userInfo.FirstName;
      }
    });
    this.checkStorage.getEvent().subscribe(value => {
      if (value.value === 'overviewPage') {
        if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
          const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
          this.username = userInfo.FirstName;
        }
      }
    });
  }
  /*angular theme */

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }
  /*angular theme */

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
