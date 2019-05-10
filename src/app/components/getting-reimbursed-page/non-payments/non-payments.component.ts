import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GettingReimbursedSharedService } from '../../../shared/getting-reimbursed/getting-reimbursed-shared.service';

@Component({
  selector: 'app-non-payments',
  templateUrl: './non-payments.component.html',
  styleUrls: ['./non-payments.component.scss']
})
export class NonPaymentsComponent implements OnInit {
  title = 'Top Reasons for Claims Non-Payment';
  timePeriod = 'Last 6 Months';
  section: any = [];
  summaryItems: any;
  pageTitle: String = '';
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  nonPaymentItems: Array<Object> = [{}];

  barChartsArray = [
    {
      type: 'singleBarChart',
      title: 'Need More Information',
      data: {
        barHeight: 40,
        barData: 100,
        barSummation: 300,
        barText: 'Need More Information',
        color: [{ color1: '#3381FF' }],
        gdata: ['card-inner-large', 'reasonOneBar']
      }
      // timeperiod: 'Last 6 Months'
    },
    {
      type: 'singleBarChart',
      title: 'No Auth Notice Ref',
      data: {
        barHeight: 40,
        barData: 70,
        barSummation: 300,
        barText: 'Need More Information',
        color: [{ color1: '#3381FF' }],
        gdata: ['card-inner-large', 'reasonOneBar']
      }
      // timeperiod: 'Last 6 Months'
    },
    {
      type: 'singleBarChart',
      title: 'Claims Payment Policy',
      data: {
        barHeight: 40,
        barData: 100,
        barSummation: 300,
        barText: 'Need More Information',
        color: [{ color1: '#3381FF' }],
        gdata: ['card-inner-large', 'reasonOneBar']
      }
      // timeperiod: 'Last 6 Months'
    },
    {
      type: 'singleBarChart',
      title: 'No Benefit Coverage',
      data: {
        barHeight: 40,
        barData: 100,
        barSummation: 300,
        barText: 'Need More Information',
        color: [{ color1: '#3381FF' }],
        gdata: ['card-inner-large', 'reasonOneBar']
      }
      // timeperiod: 'Last 6 Months'
    },
    {
      type: 'singleBarChart',
      title: 'Not Categorized',
      data: {
        barHeight: 40,
        barData: 100,
        barSummation: 300,
        barText: 'Need More Information',
        color: [{ color1: '#3381FF' }],
        gdata: ['card-inner-large', 'reasonOneBar']
      }
      // timeperiod: 'Last 6 Months'
    }
    /*{
      title: 'Need More Information',
      value: '$2.6M',
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
      value: '$354.8K',
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
    }*/
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
    this.gettingReimbursedSharedService.getGettingReimbursedData().then(completeData => {
      this.summaryItems = JSON.parse(JSON.stringify(completeData));
      this.currentSummary = this.summaryItems[2].data;
      this.currentTabTitle = this.summaryItems[2].title;
      console.log(this.currentSummary);
    });

    /* this.nonPaymentItems = [
      {
        type: 'singleBarChart',
        title: 'Top Reasons for Prior Authorizations Not Approved',
        data: {
          barHeight: 40,
          barData: 300,
          barSummation: 300,
          barText: 'Need More Information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']
      },
      {
        type: 'singleBarChart',
        title: 'Top Reasons for Prior Authorizations Not Approved',
        data: {
          barHeight: 40,
          barData: 200,
          barSummation: 300,
          barText: 'Need More Information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']}
      },
      {
        type: 'singleBarChart',
        title: 'Top Reasons for Prior Authorizations Not Approved',
        data: {
          barHeight: 40,
          barData: 170,
          barSummation: 300,
          barText: 'Need More Information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']
      },
      {
        type: 'singleBarChart',
        title: 'Top Reasons for Prior Authorizations Not Approved',
        data: {
          barHeight: 40,
          barData: 170,
          barSummation: 300,
          barText: 'Need More Information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']},
          timeperiod: 'Last 6 Months'
      },
      {
        type: 'singleBarChart',
        title: 'Top Reasons for Prior Authorizations Not Approved',
        data: {
          barHeight: 40,
          barData: 170,
          barSummation: 300,
          barText: 'Need More Information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']},
          timeperiod: 'Last 6 Months'
      }
    ];*/
  }
}
