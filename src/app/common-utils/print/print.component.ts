import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  @select(['uhc', 'currentPage']) currentPage;
  @Input() queryParams: any = {};
  selectedPage;
  overviewBool: boolean;
  printDisable: boolean;
  constructor(private iconRegistry: MatIconRegistry, private readonly sanitizer: DomSanitizer, private router: Router) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    this.iconRegistry.addSvgIcon(
      'print-icon',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/print-icon.svg')
    );
    if (this.router.url.includes('print-')) {
      this.printDisable = true;
    }
  }

  ngOnInit() {
    this.currentPage.subscribe(currentPage => (this.selectedPage = currentPage));
    if (this.selectedPage === 'overviewPage') {
      this.overviewBool = true;
    }
  }
  printIconClick() {
    // window.open(this.router.url + '/print-page', '_blank');
    this.router.navigate(['print-page'], { queryParams: this.queryParams });
  }
}
