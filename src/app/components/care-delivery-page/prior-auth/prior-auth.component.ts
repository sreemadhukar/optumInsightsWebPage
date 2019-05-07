import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { SessionService } from '../../../shared/session.service';

@Component({
  selector: 'app-prior-auth',
  templateUrl: './prior-auth.component.html',
  styleUrls: ['./prior-auth.component.scss']
})
export class PriorAuthComponent implements OnInit {
  summaryItems: Array<Object> = [{}];
  reasonItems: Array<Object> = [{}];
  pageTitle: String = '';
  pagesubTitle: String = '';
  userName: String = '';
  constructor(private priorAuthService: PriorAuthService, private sessionService: SessionService) {
    this.pagesubTitle = '';
  }

  ngOnInit() {
    const parameters = [this.sessionService.providerkey.toString(), true];
    this.priorAuthService.getPriorAuthData(...parameters).subscribe(data => {
      console.log(data.PriorAuth.LineOfBusiness.All);
    });
    this.pageTitle = 'Prior Authorizations';
    this.summaryItems = [
      {
        category: 'app-card',
        type: 'donutWithLabel',
        title: 'Prior Authorization Requested',
        data: {
          graphValues: [50, 40, 7, 3],
          centerNumber: '57K',
          color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],

          gdata: ['card-inner', 'PARequested']
        },
        besideData: {
          labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
          color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        category: 'app-card',
        type: 'donutWithLabel',
        title: 'Prior Authorization Approval Rate',
        data: {
          graphValues: [78, 22],
          centerNumber: '78 %',
          color: ['#3381FF', '#E0E0E0'],
          gdata: ['card-inner', 'PAApprovalRate']
        },
        besideData: {
          verticalData: [
            { title: 'Average Turnaround Time' },
            { values: '3 Days', labels: 'Standard' },
            { values: '18 Hours', labels: 'Urgent' }
          ]
        },

        timeperiod: 'Rolling 12 Months'
      }
    ];

    this.reasonItems = [
      {
        type: 'singleBarChart',
        title: 'Top Reason Not Approved',
        data: {
          barHeight: 48,
          barData: 50,
          barSummation: 150,
          barText: 'No Evidence',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonOneBar']
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        type: 'singleBarChart',
        title: 'Top Reason Not Approved',
        data: {
          barHeight: 48,
          barData: 40,
          barSummation: 150,
          barText: 'Need more information',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonTwoBar']
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        type: 'singleBarChart',
        title: 'Top Reason Not Approved',
        data: {
          barHeight: 48,
          barData: 60,
          barSummation: 150,
          barText:
            'Medical equipment which cannot withstand repeated use OR is disposable, OR is not used to serve a medical purpose, ' +
            'OR is generally not useful to a person in the absence of a Sickness or Injury, OR is not appropriate for use in the home',
          color: [{ color1: '#3381FF' }],
          gdata: ['card-inner-large', 'reasonThreeBar']
        },
        timeperiod: 'Rolling 12 Months'
      }
    ];
  }
}
