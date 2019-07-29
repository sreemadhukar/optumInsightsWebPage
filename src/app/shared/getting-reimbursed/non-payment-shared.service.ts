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
  private paramtersCategories: any;
  constructor(
    private nonPaymentService: NonPaymentService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}

  /** Function to show hovers labels as per Lob**/
  public returnHoverLabels(cardData) {
    const hoverLabels = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverLabels.push('Medicare & Retirement');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverLabels.push('Community & State');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverLabels.push('Employer & Individual');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverLabels.push('Uncategorized');
        }
      }
      return hoverLabels;
    }
  }

  /** Function to show hovers colors as per Lob**/
  public returnLobColor(cardData) {
    const hoverColors = [];
    if (cardData !== null) {
      if (this.session.filterObjValue.lob === 'All') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
        }
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
        }
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
        }
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
        }
      } else if (this.session.filterObjValue.lob === 'Medicare & Retirement') {
        if (cardData.hasOwnProperty('Mr')) {
          hoverColors.push('#3381FF');
        }
      } else if (this.session.filterObjValue.lob === 'Community & State') {
        if (cardData.hasOwnProperty('Cs')) {
          hoverColors.push('#80B0FF');
        }
      } else if (this.session.filterObjValue.lob === 'Employer & Individual') {
        if (cardData.hasOwnProperty('Ei')) {
          hoverColors.push('#003DA1');
        }
      } else if (this.session.filterObjValue.lob === 'Uncategorized') {
        if (cardData.hasOwnProperty('Un')) {
          hoverColors.push('#00B8CC');
        }
      }
      return hoverColors;
    }
  }
  // The getNonPayment() function fetches data for Claims Not Paid and Claims Non-Payment Rate
  public getNonPayment() {
    this.tin = this.session.filterObjValue.tax.toString().replace('-', '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      let parameters;
      if (
        this.timeFrame === 'Last 12 Months' ||
        this.timeFrame === 'Last 6 Months' ||
        this.timeFrame === 'Last 3 Months' ||
        this.timeFrame === 'Last 30 Days' ||
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
        } else if (this.timeFrame === 'Last 3 Months') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last3Months' }];
          }
        } else if (this.timeFrame === 'Last 30 Days') {
          if (this.tin !== 'All' && this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
            ];
          } else if (this.tin !== 'All') {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
          } else if (this.lob !== 'All') {
            parameters = [
              this.providerKey,
              { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
            ];
          } else {
            parameters = [this.providerKey, { TimeFilter: 'Last30Days' }];
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
            let claimsNotPaid: Object;
            let claimsNotPaidRate: Object;
            if (
              nonPaymentData1.hasOwnProperty('All') &&
              nonPaymentData1.All != null &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const nonPaidData = [];
              if (nonPaymentData1.hasOwnProperty('Mr') && nonPaymentData1.Mr != null) {
                if (
                  nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Mr.ClaimsLobSummary.length &&
                  nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Cs') && nonPaymentData1.Cs != null) {
                if (
                  nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Cs.ClaimsLobSummary.length &&
                  nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Ei') && nonPaymentData1.Ei != null) {
                if (
                  nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Ei.ClaimsLobSummary.length &&
                  nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Un') && nonPaymentData1.Un != null) {
                if (
                  nonPaymentData1.Un.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Un.ClaimsLobSummary.length &&
                  nonPaymentData1.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(nonPaymentData1.All.ClaimsLobSummary[0].AmountDenied),
                  color: this.returnLobColor(nonPaymentData1),
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(nonPaymentData1),
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
                status: 404,
                title: 'Claims Not Paid',
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
                status: 404,
                title: 'Claims Non-Payment Rate',
                data: null,
                timeperiod: null
              };
            } // end if else
            this.summaryData = [];
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Non Payment Page , Error for two donuts Data', err);
          }
        );
      } else {
        const lobData = this.common.matchLobWithData(this.lob);
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
        this.nonPaymentService.getNonPaymentData(...parameters).subscribe(
          ([nonPaymentData1]) => {
            let claimsNotPaid: Object;
            let claimsNotPaidRate: Object;
            if (
              nonPaymentData1.hasOwnProperty('All') &&
              nonPaymentData1.All != null &&
              nonPaymentData1.All.hasOwnProperty('ClaimsLobSummary') &&
              nonPaymentData1.All.ClaimsLobSummary.length &&
              nonPaymentData1.All.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
            ) {
              const nonPaidData = [];
              if (nonPaymentData1.hasOwnProperty('Mr') && nonPaymentData1.Mr != null) {
                if (
                  nonPaymentData1.Mr.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Mr.ClaimsLobSummary.length &&
                  nonPaymentData1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Mr.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Cs') && nonPaymentData1.Cs != null) {
                if (
                  nonPaymentData1.Cs.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Cs.ClaimsLobSummary.length &&
                  nonPaymentData1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Cs.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Ei') && nonPaymentData1.Ei != null) {
                if (
                  nonPaymentData1.Ei.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Ei.ClaimsLobSummary.length &&
                  nonPaymentData1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Ei.ClaimsLobSummary[0].AmountDenied);
                }
              }
              if (nonPaymentData1.hasOwnProperty('Un') && nonPaymentData1.Un != null) {
                if (
                  nonPaymentData1.Un.hasOwnProperty('ClaimsLobSummary') &&
                  nonPaymentData1.Un.ClaimsLobSummary.length &&
                  nonPaymentData1.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
                ) {
                  nonPaidData.push(nonPaymentData1.Un.ClaimsLobSummary[0].AmountDenied);
                }
              }
              claimsNotPaid = {
                category: 'app-card',
                type: 'donutWithLabel',
                title: 'Claims Not Paid',
                data: {
                  graphValues: nonPaidData,
                  centerNumber:
                    this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].AmountDenied) < 1 &&
                    this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].AmountDenied) > 0
                      ? '< $1'
                      : '$' + this.common.nFormatter(nonPaymentData1[lobData].ClaimsLobSummary[0].AmountDenied),
                  color: this.returnLobColor(nonPaymentData1),
                  gdata: ['card-inner', 'claimsNotPaid'],
                  sdata: {
                    sign: '',
                    data: ''
                  },
                  labels: this.returnHoverLabels(nonPaymentData1),
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
                status: 404,
                title: 'Claims Not Paid',
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
                status: 404,
                title: 'Claims Non-Payment Rate',
                data: null,
                timeperiod: null
              };
            } // end if else
            this.summaryData = [];
            this.summaryData.push(claimsNotPaid, claimsNotPaidRate);
            resolve(this.summaryData);
          },
          err => {
            console.log('Non Payments Donut Error Data', err);
          }
        );
      }
    });
  } // end funtion getNonPayment()

  getParmaeterCategories() {
    if (
      this.timeFrame === 'Last 12 Months' ||
      this.timeFrame === 'Last 6 Months' ||
      this.timeFrame === 'Last 3 Months' ||
      this.timeFrame === 'Last 30 Days' ||
      this.timeFrame === 'Year to Date'
    ) {
      if (this.timeFrame === 'Last 12 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last12Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last12Months' }
          ];
        } else {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last12Months' }];
        }
      } else if (this.timeFrame === 'Year to Date') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'YTD', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'YTD' }
          ];
        } else {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'YTD' }];
        }
      } else if (this.timeFrame === 'Last 6 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last6Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last6Months' }
          ];
        } else {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last6Months' }];
        }
      } else if (this.timeFrame === 'Last 3 Months') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last3Months', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last3Months' }
          ];
        } else {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last3Months' }];
        }
      } else if (this.timeFrame === 'Last 30 Days') {
        if (this.tin !== 'All' && this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days', Tin: this.tin }
          ];
        } else if (this.tin !== 'All') {
          this.paramtersCategories = [this.providerKey, { TimeFilter: 'Last30Days', Tin: this.tin }];
        } else if (this.lob !== 'All') {
          this.paramtersCategories = [
            this.providerKey,
            { Lob: this.common.matchLobWithCapsData(this.lob), TimeFilter: 'Last30Days' }
          ];
        }
      }
    } else {
      const lobData = this.common.matchLobWithData(this.lob);
      if (this.tin !== 'All' && this.lob !== 'All') {
        this.paramtersCategories = [
          this.providerKey,
          {
            Lob: this.common.matchLobWithCapsData(this.lob),
            TimeFilter: 'CalendarYear',
            TimeFilterText: this.timeFrame,
            Tin: this.tin
          }
        ];
      } else if (this.tin !== 'All') {
        this.paramtersCategories = [
          this.providerKey,
          { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }
        ];
      } else if (this.lob !== 'All') {
        this.paramtersCategories = [
          this.providerKey,
          {
            Lob: this.common.matchLobWithCapsData(this.lob),
            TimeFilter: 'CalendarYear',
            TimeFilterText: this.timeFrame
          }
        ];
      } else {
        this.paramtersCategories = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame }];
      }
    } // End If else structure
  } // end getParmaeterCategories() function for Top Reasons Categories

  public getNonPaymentCategories() {
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();

    // Assign the paramater variable
    this.paramtersCategories = [];
    this.getParmaeterCategories();
    return new Promise(resolve => {
      this.sharedTopCategories(this.paramtersCategories)
        .then(topReasons => {
          try {
            const p = JSON.parse(JSON.stringify(topReasons)); // Values descending here
            const subCategoryReasons: any = [];
            for (let i = 0; i < p.length; i++) {
              let x = JSON.parse(JSON.stringify(this.paramtersCategories)); // deep copy
              x[1]['denialCategory'] = p[i]['title'];
              subCategoryReasons.push(x);
              x = [];
            }
            if (topReasons === null) {
              return null;
            }
            return this.sharedTopSubCategories(subCategoryReasons, p);
          } catch (Error) {
            return null;
          }
        })
        .then(finalData => {
          if (finalData === null) {
            return resolve(null);
          }
          return resolve(finalData);
        });
    });
  } // end getNonPaymentCategories function

  public sharedTopSubCategories(paramtersSubCategory, arrayTemp) {
    this.timeFrame = this.session.filterObjValue.timeFrame;
    return new Promise(resolve => {
      this.nonPaymentService.getNonPaymentSubCategories(paramtersSubCategory).subscribe(
        data => {
          const mappedData = data.map(item => item[0]);
          // console.log('5 parameters', mappedData);
          for (let i = 0; i < arrayTemp.length; i++) {
            arrayTemp[i]['top5'] = mappedData[i].All.DenialCategory;
            const p = arrayTemp[i]['top5'];
            for (let j = 0; j < p.length; j++) {
              p[j].text = p[j]['Claimdenialcategorylevel1shortname'];
              p[j].valueNumeric = p[j]['DenialAmount'];
              p[j].value = '$' + this.common.nFormatter(p[j]['DenialAmount']);
              delete p[j].Claimdenialcategorylevel1shortname;
              delete p[j].DenialAmount;
            }
          }
          resolve(arrayTemp);
        },
        error => {
          resolve(null);
          console.log('Error Shared Top Sub Categories', error);
        }
      );
    });
  }
  public sharedTopCategories(parameters) {
    this.timeFrame = this.session.filterObjValue.timeFrame;
    return new Promise(resolve => {
      /** Get Top 5 Categories Data */
      this.nonPaymentService.getNonPaymentTopCategories(...parameters).subscribe(
        ([topCategories]) => {
          try {
            const topReasons: Array<object> = [];
            let tempArray: any;
            // tempArray = topCategories.All.DenialCategory.filter(x => x.Claimdenialcategorylevel1shortname !== 'UNKNOWN');
            tempArray = JSON.parse(JSON.stringify(topCategories.All.DenialCategory));
            if (topCategories.All.DenialCategory > 5) {
              tempArray
                .sort(function(a, b) {
                  return b.DenialAmount - a.DenialAmount;
                })
                .slice(0, 5); // Descending
            } else {
              tempArray.sort(function(a, b) {
                return b.DenialAmount - a.DenialAmount;
              }); // Descending
            }
            for (let i = 0; i < tempArray.length; i++) {
              topReasons.push({
                title: tempArray[i].Claimdenialcategorylevel1shortname,
                value: '$' + this.common.nFormatter(tempArray[i].DenialAmount),
                numeric: tempArray[i].DenialAmount
              });
            }
            resolve(topReasons);
          } catch (Error) {
            resolve(null);
          }
        },
        error => {
          resolve(null);
          console.log('Non payment Data Error ', error);
        }
      );
      /** Ends Shared Top Categories Data */
    });
  } // end sharedTopCategories Function
}
