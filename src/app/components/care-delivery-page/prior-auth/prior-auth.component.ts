import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';

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
  subscription: any;

  constructor(
    private priorAuthService: PriorAuthService,
    private sessionService: SessionService,
    private checkStorage: StorageService
  ) {
    this.pagesubTitle = '';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  ngOnInit() {
    const parameters = [this.sessionService.providerkey.toString(), true];
    this.pageTitle = 'Prior Authorizations';

    this.priorAuthService.getPriorAuthData(...parameters).subscribe(data => {
      const PAApprovedCount = data.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount;
      const PANotApprovedCount = data.PriorAuth.LineOfBusiness.All.PriorAuthNotApprovedCount;
      const PANotPendingCount = data.PriorAuth.LineOfBusiness.All.PriorAuthPendingCount;
      const PANotCancelledCount = data.PriorAuth.LineOfBusiness.All.PriorAuthCancelledCount;
      const PARequestedCount = PAApprovedCount + PANotApprovedCount + PANotPendingCount + PANotCancelledCount;
      const PAApprovalRate = PAApprovedCount / PARequestedCount;
      const StandardTATConversion = (data.PriorAuth.LineOfBusiness.All.StandartPriorAuthTAT / 86400).toFixed(0);
      const UrgentTATConversion = (data.PriorAuth.LineOfBusiness.All.UrgentPriorAuthTAT / 3600).toFixed(0);
      this.summaryItems = [
        {
          category: 'app-card',
          type: 'donutWithLabel',
          title: 'Prior Authorization Requested',
          data: {
            graphValues: [PAApprovedCount, PANotApprovedCount, PANotPendingCount, PANotCancelledCount],
            centerNumber: this.nFormatter(PARequestedCount, 1),
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],

            gdata: ['card-inner', 'PARequested']
          },
          besideData: {
            labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          timeperiod: 'Last 6 Months'
        },
        {
          category: 'app-card',
          type: 'donutWithLabel',
          title: 'Prior Authorization Approval Rate',
          data: {
            graphValues: [PAApprovalRate, 1 - PAApprovalRate],
            centerNumber: (PAApprovalRate * 100).toFixed(0) + '%',
            color: ['#3381FF', '#E0E0E0'],
            gdata: ['card-inner', 'PAApprovalRate']
          },
          besideData: {
            verticalData: [
              { title: 'Average Turnaround Time' },
              { values: StandardTATConversion + ' Days', labels: 'Standard' },
              { values: UrgentTATConversion + ' Hours', labels: 'Urgent' }
            ]
          },

          timeperiod: 'Last 6 Months'
        }
      ];
    });

    const newParameters = [
      this.sessionService.providerkey.toString(),
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      true
    ];
    const timeRange = 'rolling12';
    const isAllTin = true;
    const isAlllob = true;
    const isAllSS = true;

    this.priorAuthService
      .getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters)
      .subscribe(data => {
        const PriorAuthNotApprovedReasons = data.All.NotApproved.AllNotApprovedSettings;
        PriorAuthNotApprovedReasons.sort(function(a, b) {
          return b.Count - a.Count;
        });

        const barScaleMax = PriorAuthNotApprovedReasons[0].Count;

        this.reasonItems = [
          {
            type: 'singleBarChart',
            title: 'Top Reasons for Prior Authorizations Not Approved',
            data: {
              barHeight: 40,
              barData: PriorAuthNotApprovedReasons[0].Count,
              barSummation: barScaleMax,
              barText: PriorAuthNotApprovedReasons[0].Reason,
              color: [{ color1: '#3381FF' }],
              gdata: ['card-inner-large', 'reasonOneBar']
            },
            timeperiod: 'Last 12 Months'
          },
          {
            type: 'singleBarChart',
            title: 'Top Reason Not Approved',
            data: {
              barHeight: 40,
              barData: PriorAuthNotApprovedReasons[1].Count,
              barSummation: barScaleMax,
              barText: PriorAuthNotApprovedReasons[1].Reason,
              color: [{ color1: '#3381FF' }],
              gdata: ['card-inner-large', 'reasonTwoBar']
            },
            timeperiod: 'Last 12 Months'
          },
          {
            type: 'singleBarChart',
            title: 'Top Reason Not Approved',
            data: {
              barHeight: 40,
              barData: PriorAuthNotApprovedReasons[2].Count,
              barSummation: barScaleMax,
              barText: PriorAuthNotApprovedReasons[2].Reason,
              color: [{ color1: '#3381FF' }],
              gdata: ['card-inner-large', 'reasonThreeBar']
            },
            timeperiod: 'Last 12 Months'
          },
          {
            type: 'singleBarChart',
            title: 'Top Reason Not Approved',
            data: {
              barHeight: 40,
              barData: PriorAuthNotApprovedReasons[3].Count,
              barSummation: barScaleMax,
              barText: PriorAuthNotApprovedReasons[3].Reason,
              color: [{ color1: '#3381FF' }],
              gdata: ['card-inner-large', 'reasonFourBar']
            },
            timeperiod: 'Last 12 Months'
          },
          {
            type: 'singleBarChart',
            title: 'Top Reason Not Approved',
            data: {
              barHeight: 40,
              barData: PriorAuthNotApprovedReasons[4].Count,
              barSummation: barScaleMax,
              barText: PriorAuthNotApprovedReasons[4].Reason,
              color: [{ color1: '#3381FF' }],
              gdata: ['card-inner-large', 'reasonFiveBar']
            },
            timeperiod: 'Last 12 Months'
          }
        ];
      });
  }
}
