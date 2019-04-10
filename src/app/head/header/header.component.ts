import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Input,
  Renderer2,
  ViewEncapsulation,
  ViewChildren,
  QueryList
} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatExpansionPanel } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    public el: ElementRef,
    private renderer: Renderer2,
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'person',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-person-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'expand-more',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/round-expand_more-24px.svg')
    );
  }

  ngOnInit() {}

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
