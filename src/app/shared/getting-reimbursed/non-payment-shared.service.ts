import { Injectable } from '@angular/core';
import { GettingReimbursedModule } from '../../components/getting-reimbursed-page/getting-reimbursed.module';
import { NonPaymentService } from './../../rest/getting-reimbursed/non-payment.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';

@Injectable({
  providedIn: GettingReimbursedModule
})
export class NonPaymentSharedService {
  public providerKey;
  public summaryData: Array<object> = [];
  public timeFrame: string;
  private tin: string;
  private lob: string;
  constructor(
    private nonPaymentService: NonPaymentService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}
  public getNonPayment() {
    this.tin = this.session.filterObjValue.tax.toString().replace('-', '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      let parameters;
      console.log(this.timeFrame);
      if (
        this.timeFrame === 'Last 12 Months' ||
        this.timeFrame === 'Last 6 Months' ||
        this.timeFrame === 'Year to Date'
      ) {
        if (this.timeFrame === 'Last 12 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last12Months' }];
          }
        } else if (this.timeFrame === 'Year to Date') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [this.providerKey, { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'YTD' }];
          }
        } else if (this.timeFrame === 'Last 6 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last6Months' }];
          }
        }

        // let nonPayment: object;

        this.nonPaymentService.getNonPaymentData(...parameters).subscribe(
          ([nonPaymentData1]) => {
            console.log(nonPaymentData1);
            let claimsNotPaid: Object;
            let claimsNotPaidRate: Object;
            if (
              nonPaymentData1.hasOwnProperty('All') &&
              nonPaymentData1.All != null &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
            ) {
              const nonPaidData = [];
              if (nonPaymentData1.hasOwnProperty('Mr') && nonPaymentData1.Mr != null) {
                if (
                  nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Mr.ClaimsLobSummary.length &&
                  nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Mr.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Cs') && nonPaymentData1.Cs != null) {
                if (
                  nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Cs.ClaimsLobSummary.length &&
                  nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Cs.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Ei') && nonPaymentData1.Ei != null) {
                if (
                  nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Ei.ClaimsLobSummary.length &&
                  nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Ei.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Un') && nonPaymentData1.Un != null) {
                if (
                  nonPaymentData1.Un.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Un.ClaimsLobSummary.length &&
                  nonPaymentData1.Un.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Un.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied) < 1 &&
                    this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].ClaimsDenied),
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: null,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              nonPaymentData1.hasOwnProperty('All') &&
              nonPaymentData1.All != null &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Non-Payment Rate',
                data: {
                  graphValues: [
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate,
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsYieldRate
                  ],
                  centerNumber:
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                    nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                      ? '< 1%'
                      : nonPaymentData1.All.ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsNonPaymentRate'],
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                timeperiod: null
              };
            } // end if else
            this.summaryData = [];
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Calls Error Data', err);
          }
        );
      } else {
        console.log(this.timeFrame);
        const lobData = this.common.matchLobWithCapsData(this.lob);
        if (this.tin !== 'All' && this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame,
              Tin: this.tin
            }
          ];
        } else if (this.tin !== 'All') {
          parameters = [
            this.providerKey,
            { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }
          ];
        } else if (this.lob !== 'All') {
          parameters = [
            this.providerKey,
            {
              Lob: this.common.matchLobWithCapsData(this.lob),
              TimeFilter: 'CalendarYear',
              TimeFilterText: this.timeFrame
            }
          ];
        } else {
          parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
        }
        console.log(parameters[1]);
        this.nonPaymentService.getNonPaymentData(...parameters).subscribe(
          ([nonPaymentData1]) => {
            let claimsNotPaid: Object;
            let claimsNotPaidRate: Object;
            if (
              nonPaymentData1.hasOwnProperty('All') &&
              nonPaymentData1.All != null &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
            ) {
              const nonPaidData = [];
              if (nonPaymentData1.hasOwnProperty('Mr') && nonPaymentData1.Mr != null) {
                if (
                  nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Mr.ClaimsLobSummary.length &&
                  nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Mr.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Cs') && nonPaymentData1.Cs != null) {
                if (
                  nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Cs.ClaimsLobSummary.length &&
                  nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Cs.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Ei') && nonPaymentData1.Ei != null) {
                if (
                  nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Ei.ClaimsLobSummary.length &&
                  nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Ei.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Un') && nonPaymentData1.Un != null) {
                if (
                  nonPaymentData1.Un.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Un.ClaimsLobSummary.length &&
                  nonPaymentData1.Un.ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Un.ClaimsLobSummary[0].ClaimsDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsDenied) < 1 &&
                    this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsDenied),
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  hover: true
                },
                besideData: {
                  labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
                  color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: null,
                data: null,
                besideData: null,
                bottomData: null,
                timeperiod: null
              };
            }
            if (
              nonPaymentData1.hasOwnProperty(lobData) &&
              nonPaymentData1[lobData] != null &&
              nonPaymentData1[lobData].hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1[lobData].ClaimsLobSummary.length &&
              nonPaymentData1[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate') &&
              nonPaymentData1[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsNonPaymentRate')
            ) {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: 'Claims Non-Payment Rate',
                data: {
                  graphValues: [
                    nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate,
                    nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsYieldRate
                  ],
                  centerNumber:
                    nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate < 1 &&
                    nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate > 0
                      ? '< 1%'
                      : nonPaymentData1[lobData].ClaimsLobSummary[0].ClaimsNonPaymentRate + '%',
                  color: ['#3381FF', '#D7DCE1'],
                  gdata: ['card-inner', 'claimsNonPaymentRate'],
                  sdata: null
                },
                timeperiod: this.timeFrame
              };
            } else {
              claimsNotPaidRate = {
                category: 'app-card',
                type: 'donut',
                title: null,
                data: null,
                timeperiod: null
              };
            } // end if else
            this.summaryData = [];
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Calls Error Data', err);
          }
        );
      }
    });
  }
}
