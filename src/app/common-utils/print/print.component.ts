import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @Input() route: string;
  @Output() printClick = new EventEmitter();
  overviewBool: boolean;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'print-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/print-icon.svg')
    );
  }

  ngOnInit() {
    if (this.route === '/OverviewPage/print-overview') {
      this.overviewBool = true;
    }
  }
  printIconClick() {
    console.log('working fine', this.route);
    if (this.route === '/OverviewPage/print-overview') {
      this.router.navigate(['print-page/overview']);
      this.overviewBool = true;
    } else if (this.route === '/GettingReimbursed/print-grSummary') {
      this.router.navigate(['print-page/grSummary']);
    } else if (this.route === '/GettingReimbursed/Payments/print-payments') {
      this.router.navigate(['print-page/payments']);
    }

    this.printClick.emit(this.route);
  }
}
