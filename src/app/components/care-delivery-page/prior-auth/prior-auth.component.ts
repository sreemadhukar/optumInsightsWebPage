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
      console.log(data);
    });
    this.pageTitle = 'Prior Authorizations';
    this.summaryItems = [
      {
        category: 'card',
        type: 'donutWithTrend',
        title: 'Prior Authorization Requested',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'up',
          data: '+2.3%'
        },
        timeperiod: 'Rolling 12 Months'
      },
      {
        category: 'card',
        type: 'donutBothLabelTrend',
        title: 'Prior Authorization Approval Rate',
        data: {
          cValues: [],
          cData: '',
          color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
          gdata: []
        },
        sdata: {
          sign: 'down',
          data: '-2.3%'
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
