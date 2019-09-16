import { Injectable } from '@angular/core';
import { TopRowAdvOverviewService } from '../../rest/advocate/top-row-adv-overview.service';
import { AdvocateModule } from '../../components/advocate/advocate.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';

@Injectable({
  providedIn: AdvocateModule
})
export class TopRowAdvOverviewSharedService {
  public timeFrame;
  public tin;
  public lob;
  public providerKey;
  constructor(
    private topRowService: TopRowAdvOverviewService,
    private MetricidService: GlossaryMetricidService,
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

  getParmaeterCategories() {
    let parameters = [];
    this.tin = this.session.filterObjValue.tax.toString().replace(/-/g, '');
    this.lob = this.session.filterObjValue.lob;
    this.timeFrame = this.session.filterObjValue.timeFrame;
    this.providerKey = this.session.providerKeyData();
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
      }
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
        parameters = [this.providerKey, { TimeFilter: 'CalendarYear', TimeFilterText: this.timeFrame, Tin: this.tin }];
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
    } // End If else structure
    return parameters;
  } // end getParmaeterCategories() function for Top Reasons Categories

  // The getNonPayment() function fetches data for Claims Not Paid and Claims Non-Payment Rate
  public getPaymentShared() {
    this.timeFrame = this.session.filterObjValue.timeFrame;

    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      const parameters = this.getParmaeterCategories();
      this.topRowService.getPaymentData(...parameters).subscribe(
        paymentData => {
          const paymentDataResolve = [];
          paymentDataResolve.push(
            this.claimsPaidMethod(paymentData),
            this.claimsNotPaidMethod(paymentData),
            this.totalClaimsSubmittedMethod(paymentData)
          );
          resolve(paymentDataResolve);
        },
        err => {
          console.log('Advocate Page , Error for Payment cards', err);
        }
      );
    });
  }
  public totalClaimsSubmittedMethod(paymentData): Object {
    let claimsSubmitted: Object;
    const lobData = this.common.matchLobWithData(this.lob);
    if (
      paymentData.hasOwnProperty(lobData) &&
      paymentData[lobData] != null &&
      paymentData[lobData].hasOwnProperty('ClaimsLobSummary') &&
      paymentData[lobData].ClaimsLobSummary.length &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsDenied') &&
      paymentData[lobData].ClaimsLobSummary[0].hasOwnProperty('ClaimsSubmitted')
    ) {
      claimsSubmitted = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Total Number of Claims Submitted',
        MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
        data: {
          graphValues: [
            paymentData[lobData].ClaimsLobSummary[0].ClaimsPaid,
            paymentData[lobData].ClaimsLobSummary[0].ClaimsDenied
          ],
          centerNumber: this.common.nFormatter(paymentData[lobData].ClaimsLobSummary[0].ClaimsSubmitted),
          color: ['#3381FF', '#80B0FF'],
          gdata: ['card-inner', 'totalClaimsSubmitted'],
          besideData: {
            labels: ['Paid', 'Not Paid'],
            color: ['#3381FF', '#80B0FF']
          }
        },
        sdata: {
          sign: '',
          data: ''
        },
        timeperiod: this.timeFrame
      };
    } else {
      claimsSubmitted = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Total Number of Claims Submitted',
        MetricID: this.MetricidService.MetricIDs.TotalNumberofClaimsSubmitted,
        data: null,
        status: 404,
        besideData: null,
        timeperiod: this.timeFrame
      };
    }
    return claimsSubmitted;
  }
  public claimsPaidMethod(paymentData): Object {
    let claimsPaid: Object;
    if (
      paymentData.hasOwnProperty('All') &&
      paymentData.All != null &&
      paymentData.All.hasOwnProperty('ClaimsLobSummary') &&
      paymentData.All.ClaimsLobSummary.length &&
      paymentData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
    ) {
      const nonPaidData = [];
      if (paymentData.hasOwnProperty('Mr') && paymentData.Mr != null) {
        if (
          paymentData.Mr.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Mr.ClaimsLobSummary.length &&
          paymentData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Mr.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Cs') && paymentData.Cs != null) {
        if (
          paymentData.Cs.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Cs.ClaimsLobSummary.length &&
          paymentData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Cs.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Ei') && paymentData.Ei != null) {
        if (
          paymentData.Ei.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Ei.ClaimsLobSummary.length &&
          paymentData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Ei.ClaimsLobSummary[0].AmountPaid);
        }
      }
      if (paymentData.hasOwnProperty('Un') && paymentData.Un != null) {
        if (
          paymentData.Un.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Un.ClaimsLobSummary.length &&
          paymentData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          nonPaidData.push(paymentData.Un.ClaimsLobSummary[0].AmountPaid);
        }
      }
      claimsPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
        data: {
          graphValues: nonPaidData,
          centerNumber:
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid) > 0
              ? '< $1'
              : '$' + this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountPaid),
          color: this.returnLobColor(paymentData),
          gdata: ['card-inner', 'claimsPaid'],
          besideData: {
            labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          sdata: {
            sign: '',
            data: ''
          },
          labels: this.returnHoverLabels(paymentData),
          hover: true
        },
        timeperiod: this.timeFrame
      };
    } else {
      claimsPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Claims Not Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
    }
    return claimsPaid;
  }
  public claimsNotPaidMethod(paymentData): Object {
    let claimsNotPaid: Object;
    if (
      paymentData.hasOwnProperty('All') &&
      paymentData.All != null &&
      paymentData.All.hasOwnProperty('ClaimsLobSummary') &&
      paymentData.All.ClaimsLobSummary.length &&
      paymentData.All.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
    ) {
      const nonPaidData = [];
      if (paymentData.hasOwnProperty('Mr') && paymentData.Mr != null) {
        if (
          paymentData.Mr.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Mr.ClaimsLobSummary.length &&
          paymentData.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Mr.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Cs') && paymentData.Cs != null) {
        if (
          paymentData.Cs.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Cs.ClaimsLobSummary.length &&
          paymentData.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Cs.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Ei') && paymentData.Ei != null) {
        if (
          paymentData.Ei.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Ei.ClaimsLobSummary.length &&
          paymentData.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Ei.ClaimsLobSummary[0].AmountDenied);
        }
      }
      if (paymentData.hasOwnProperty('Un') && paymentData.Un != null) {
        if (
          paymentData.Un.hasOwnProperty('ClaimsLobSummary') &&
          paymentData.Un.ClaimsLobSummary.length &&
          paymentData.Un.ClaimsLobSummary[0].hasOwnProperty('AmountDenied')
        ) {
          nonPaidData.push(paymentData.Un.ClaimsLobSummary[0].AmountDenied);
        }
      }
      claimsNotPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        title: 'Claims Not Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
        data: {
          graphValues: nonPaidData,
          centerNumber:
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied) < 1 &&
            this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied) > 0
              ? '< $1'
              : '$' + this.common.nFormatter(paymentData.All.ClaimsLobSummary[0].AmountDenied),
          color: this.returnLobColor(paymentData),
          gdata: ['card-inner', 'claimsNotPaid'],
          besideData: {
            labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual', 'Uncategorized'],
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC']
          },
          labels: this.returnHoverLabels(paymentData),
          hover: true
        },
        sdata: {
          sign: '',
          data: ''
        },
        timeperiod: this.timeFrame
      };
    } else {
      claimsNotPaid = {
        category: 'small-card',
        type: 'donutWithLabel',
        status: 404,
        title: 'Claims Not Paid',
        MetricID: this.MetricidService.MetricIDs.ClaimsNotPaid,
        data: null,
        besideData: null,
        bottomData: null,
        timeperiod: null
      };
    }
    return claimsNotPaid;
  }
}
