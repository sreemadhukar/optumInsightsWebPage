import { Injectable } from '@angular/core';
import { PriorAuthService } from '../../rest/prior-auth/prior-auth.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class PriorAuthSharedService {
  private priorAuthData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;

  constructor(
    private priorAuthService: PriorAuthService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}

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

  public getPCORData() {
    this.providerKey = this.session.providerKey();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const parametersExecutive = [this.providerKey, true];

      this.priorAuthService.getPriorAuthData(...parametersExecutive).subscribe(
        data => {
          const PCORData = data.PatientCareOpportunity;
          let PCORChecker;
          if (PCORData === null) {
            PCORChecker = false;
          } else {
            PCORChecker = true;
          }
          resolve(PCORChecker);
        },
        err => {
          console.log('Prior Auth Counts Error', err);
        }
      );
    });
  }

  public getPriorAuthNotApprovedReasons() {
    this.providerKey = this.session.providerKey();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];
      const timeRange = 'rolling12';
      const isAllTin = true;
      const isAlllob = true;
      const isAllSS = true;

      this.priorAuthService.getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters).subscribe(
        providerSystems => {
          const PriorAuthNotApprovedReasons = providerSystems.All.NotApproved.AllNotApprovedSettings;
          PriorAuthNotApprovedReasons.sort(function(a, b) {
            return b.Count - a.Count;
          });

          const barScaleMax = PriorAuthNotApprovedReasons[0].Count;

          const PriorAuthBarGraphParamaters = [];

          for (let i = 0; i < PriorAuthNotApprovedReasons.length; i++) {
            PriorAuthBarGraphParamaters.push({
              type: 'singleBarChart',
              title: 'Top Reasons for Prior Authorizations Not Approved',
              data: {
                barHeight: 40,
                barData: PriorAuthNotApprovedReasons[i].Count,
                barSummation: barScaleMax,
                barText: PriorAuthNotApprovedReasons[i].Reason,
                color: [{ color1: '#3381FF' }],
                gdata: ['card-inner-large', 'reasonBar' + i]
              },
              timeperiod: 'Last 6 Months'
            });
          }

          // this.priorAuthData.push(PriorAuthBarGraphParamaters);
          resolve(PriorAuthBarGraphParamaters);
        },
        err => {
          console.log('Prior Auth Not Approved Count Error', err);
        }
      );
    });
  }

  public getPriorAuthCounts() {
    this.providerKey = this.session.providerKey();
    this.priorAuthData = [];
    return new Promise(resolve => {
      const newParameters = [this.providerKey, true, true, true, false, true, false, false, false, true];
      const timeRange = 'rolling12';
      const isAllTin = true;
      const isAlllob = true;
      const isAllSS = true;

      this.priorAuthService
        .getPriorAuthDateRange(timeRange, isAllTin, isAlllob, isAllSS, ...newParameters)
        .subscribe(providerSystems => {
          const data = providerSystems.PriorAuthorizations.LineOfBusiness.All;
          const PAApprovedCount = data.PriorAuthApprovedCount;
          const PANotApprovedCount = data.PriorAuthNotApprovedCount;
          const PANotPendingCount = data.PriorAuthPendingCount;
          const PANotCancelledCount = data.PriorAuthCancelledCount;
          const PARequestedCount = PAApprovedCount + PANotApprovedCount + PANotPendingCount + PANotCancelledCount;
          const PAApprovalRate = PAApprovedCount / PARequestedCount;
          const StandardTATConversion = (data.StandartPriorAuthTAT / 86400).toFixed(0);
          const UrgentTATConversion = (data.UrgentPriorAuthTAT / 3600).toFixed(0);

          const PACount = [
            {
              category: 'app-card',
              type: 'donutWithLabel',
              title: 'Prior Authorization Requested',
              data: {
                graphValues: [PAApprovedCount, PANotApprovedCount, PANotPendingCount, PANotCancelledCount],
                centerNumber: this.nFormatter(PARequestedCount, 1),
                color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                labels: ['Approved', 'Not Approved', 'Pending', 'Canceled'],
                gdata: ['card-inner', 'PARequested'],
                hover: true
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

          resolve(PACount);
        });
    });
  }
}
