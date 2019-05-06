import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss']
})
export class NonPaymentsComponent implements OnInit {
  title = 'Top Reasons for Claims Non-Payment';
  timePeriod = 'Last 6 Months';
  section: any = [];

  barChartsArray = [
    { title: 'Need More Information', value: '$2.6M' },
    { title: 'No Auth Notice Ref', value: '$999.9M' },
    { title: 'Claims Payment Policy', value: '$354.8K' },
    { title: 'No Benefit Coverage', value: '$354.2K' },
    { title: 'Not Categorized', value: '$232.2K' }
  ];

  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'open',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
  }

  ngOnInit() {}
}
