import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  @Output() helpIconClicked = new EventEmitter();
  @Input() cardType: String;
  titleHeader: String = null;
  typeOfCard: String = null;
  routhPath: string;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private router: Router) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }
  ngOnInit() {
    this.titleHeader = this.title;
    this.typeOfCard = this.cardType;
  }
  helpFunctionClicked() {
    this.helpIconClicked.emit(this.title);
  }

  titleClicked(title) {
    if (title === 'Claims Paid') {
      this.routhPath = '/GettingReimbursed/Payments';
    } else if (title === 'Prior Authorization Approval') {
      this.routhPath = '/CareDelivery/priorAuth';
    } else if (title === 'Self Service Adoption Rate') {
      this.routhPath = '/IssueResolution/SelfService';
    } else if (title === 'Claims Yield') {
      this.routhPath = '/GettingReimbursed/Payments';
    } else if (title === 'Medicare Star Rating') {
      this.routhPath = '/OverviewPage';
    } else if (title === 'Total Calls') {
      this.routhPath = '/IssueResolution/Calls';
    } else {
      this.routhPath = '/GettingReimbursed';
    }
    this.router.navigate([this.routhPath]);
  }
}
