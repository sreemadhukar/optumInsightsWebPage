import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss']
})
export class NonPaymentsComponent implements OnInit {
  title = 'Top Reasons for Claims Non-Payment';
  facilityTitle = 'Claims Non-Payments by Facility';
  timePeriod = 'Last 6 Months';
  section: any = [];
  summaryItems: any;
  pageTitle: String = '';
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  displayedColumns: string[] = [
    'facility',
    'needAdditionalInfo',
    'noAuthNoticeRef',
    'claimsPaymentsPolicy',
    'noBenefitCoverage',
    'cobNeedFortherAction'
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  barChartsArray = [
    {
      title: 'Need More Information',
      value: '$2.6M',
      numeric: 2600000,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Auth Notice Ref',
      value: '$999.9K',
      numeric: 999900,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Claims Payment Policy',
      value: '$754.8K',
      numeric: 754800,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'No Benefit Coverage',
      value: '$354.2K',
      numeric: 354200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    },
    {
      title: 'Not Categorized',
      value: '$232.2K',
      numeric: 232200,
      top5: [
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        },
        {
          text: 'Requested Information Not Submitted/Not Submitted on Time',
          value: '$1.6M'
        }
      ]
    }
  ];
  facilityData = [
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    },
    {
      facilityName: { provider: 'North Region Hospital', tin: 43730045 },
      needAdditionalInfo: '$6.4M',
      noAuthNoticeRef: '$5.3M',
      claimsPaymentsPolicy: '$4.6M',
      noBenefitCoverage: '$1.5M',
      cobNeedFortherAction: '$3.7M'
    }
  ];

  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private gettingReimbursedSharedService: GettingReimbursedSharedService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'open',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
    this.pageTitle = 'Claims Non-Payments';
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.facilityData);
    this.dataSource.paginator = this.paginator;
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[2].data;
      this.currentTabTitle = this.summaryItems[2].title;
    });
  }
}
