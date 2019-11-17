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
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'print-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/print-icon.svg')
    );
  }

  ngOnInit() {}
  printIconClick() {
    if (this.route) {
      this.router.navigate(['print-page/overview']);
    } else {
      this.router.navigate(['print-page/grSummary']);
    }
    this.printClick.emit(this.route);
  }
}
