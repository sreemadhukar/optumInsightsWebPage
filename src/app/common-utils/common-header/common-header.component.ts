import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

export interface CommonHeaderOptions {
  npsHeader: boolean;
}

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  @Input() subtitle: String;
  @Output() helpIconClicked = new EventEmitter();
  @Input() cardType: String;
  @Input() options: CommonHeaderOptions;
  titleHeader: String = null;
  typeOfCard: String = null;
  titleSubHeader: String = null;
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
    if (this.subtitle && this.subtitle.length > 0) {
      this.titleSubHeader = this.subtitle;
    }
  }
  helpFunctionClicked() {
    // Might have to remove special char for glossary to work properly
    if (this.title.charAt(this.title.length - 1) === '*') {
      const newTitle = this.title.substring(0, this.title.length - 1);
      this.helpIconClicked.emit(newTitle);
    } else {
      this.helpIconClicked.emit(this.title);
    }
  }

  titleClicked(title) {
    if (title === 'Claims Paid*') {
      this.routhPath = '/GettingReimbursed/Payments';
    } else if (title === 'Prior Authorization Approval') {
      this.routhPath = '/CareDelivery/priorAuth';
    } else if (title === 'Self Service Adoption Rate') {
      this.routhPath = '/ServiceInteraction/SelfService';
    } else if (title === 'Claims Yield*') {
      this.routhPath = '/GettingReimbursed/Payments';
    } else if (title === 'Medicare Star Rating') {
      this.routhPath = '/CareDelivery/PatientCareOpportunity';
    } else if (title === 'Calls By Call Type') {
      this.routhPath = '/ServiceInteraction/Calls';
    } else if (title === 'Patient Care Opportunity–Medicare & Retirement') {
      this.routhPath = '/CareDelivery/PatientCareOpportunity';
    } else {
      this.routhPath = '/OverviewPage';
    }
    this.router.navigate([this.routhPath]);
  }
}
