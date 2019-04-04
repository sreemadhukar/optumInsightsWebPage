import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ThemeService } from '../../shared/theme.service';
import { Observable } from 'rxjs';

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
export class HeaderComponent implements OnInit {
  @Input() button: boolean;
  public state: any;
  isDarkTheme: Observable<boolean>;

  toggleDarkTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }
  constructor(public el: ElementRef, private themeService: ThemeService) {}

  ngOnInit() {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop + 10;
    const scrollPosition = window.pageYOffset;

    if (scrollPosition < componentPosition) {
      this.state = 'show';
    } else {
      this.state = 'hide';
    }
  }
}
