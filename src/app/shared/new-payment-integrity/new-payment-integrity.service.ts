import { Injectable } from '@angular/core';
import { PaymentIntegrityTabInfoService } from '../../rest/new-payment-integrity/payment-integrity-tab-info.service';
import { NewPaymentIntegrityServiceRest } from '../../rest/new-payment-integrity/new-payment-integrity-rest.service';
import { GlossaryMetricidService } from '../../shared/glossary-metricid.service';
import { SessionService } from 'src/app/shared/session.service';

@Injectable({
  providedIn: 'root'
})
export class NewPaymentIntegrityService {
  public tabs: any;
  constructor(
    public paymentIntegrityTabInfoService: PaymentIntegrityTabInfoService,
    public newPaymentIntegrityService: NewPaymentIntegrityServiceRest,
    public MetricidService: GlossaryMetricidService,
    private session: SessionService
  ) {}

  // new payment intrgrity tab info data start
  public tabInfo() {
    return new Promise(resolve => {
      this.paymentIntegrityTabInfoService.tabInfo().subscribe(
        (response: any) => {
          for (let i = 0; i < response.length; i++) {
            const startDate = this.dateFormating(response[i].PeriodStart);
            const endDate = this.dateFormating(response[i].PeriodEnd);
            response[i].date = startDate + '&ndash;' + endDate;
            response[i].apiStartDate = response[i].PeriodStart.substring(0, response[i].PeriodStart.length - 3);
            response[i].apiEndDate = response[i].PeriodEnd.substring(0, response[i].PeriodEnd.length - 3);
          }
          resolve(response);
        },
        err => {
          console.log('PI Certification Period Dates Data Error', err);
        }
      );
    });
  }
  // new payment intrgrity tab info data end
  // new payment integrity page data start
  public paymentIntergrity(apiDates: any) {
    return new Promise(resolve => {
      this.newPaymentIntegrityService.getNewPaymentIntegrityData(apiDates).subscribe(
        response => {
          if (!response) {
            resolve(this.piDataError(response));
          } else if (response.ProviderSysKey) {
            resolve(this.piDataFormating(response));
          } else {
            resolve(this.piDataError(response));
          }
          // resolve(response);
        },
        err => {
          console.log('Check All RLP HCO Data Error', err);
        }
      );
    });
  }
  // new payment integrity page data end
  // date formating
  dateFormating(value: any) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const split = value.split('-');
    return monthNames[parseInt(split[1]) - 1] + ' ' + split[2] + ', ' + split[0];
  }
  // date formating end
  // payment integrity data formating
  piDataFormating(value: any) {
    const trendLable =
      this.trendDateFormatting(value.VarianceStart) + ' vs. ' + this.trendDateFormatting(value.VarianceEnd);
    const codingReviewResultsTarget = 90; // change target here if needed
    const mRRASTarget = 90; // change target here if needed
    let codingReviewResultsTargetValue: any;
    let mRRASTargetValue: any;

    // value.CodingReviewResultRate = codingReviewResultsTarget / 100; // remove the code once testing is done
    // value.MedicalRecordsReceivedRate = mRRASTarget / 100; // remove the code once testing is done
    // value.RequestRateTrend = 0; // remove the code once testing is done
    // value.AccountReceivableOpportunityTrend = 0; // remove the code once testing is done

    if (Math.round(value.CodingReviewResultRate * 100) < codingReviewResultsTarget) {
      codingReviewResultsTargetValue =
        codingReviewResultsTarget - Math.round(value.CodingReviewResultRate * 100) + '% below target';
    } else if (Math.round(value.CodingReviewResultRate * 100) === codingReviewResultsTarget) {
      codingReviewResultsTargetValue = 'Meets target';
    } else {
      codingReviewResultsTargetValue =
        Math.round(value.CodingReviewResultRate * 100) - codingReviewResultsTarget + '% above target';
    }
    if (Math.round(value.MedicalRecordsReceivedRate * 100) < mRRASTarget) {
      mRRASTargetValue = mRRASTarget - Math.round(value.MedicalRecordsReceivedRate * 100) + '% below target';
    } else if (Math.round(value.MedicalRecordsReceivedRate * 100) === mRRASTarget) {
      mRRASTargetValue = 'Meets target';
    } else {
      mRRASTargetValue = Math.round(value.MedicalRecordsReceivedRate * 100) - mRRASTarget + '% above target';
    }

    let medicalRecordsRequestedbyUHCTrendSign: any;
    if (value.RequestRateTrend.toFixed(1) < 0) {
      medicalRecordsRequestedbyUHCTrendSign = 'down-green';
    } else if (value.RequestRateTrend.toFixed(1) > 0) {
      medicalRecordsRequestedbyUHCTrendSign = 'up-red';
    } else {
      medicalRecordsRequestedbyUHCTrendSign = 'pi-trend-neutral';
    }
    let AccountReceivableOpportunityTrendValue: any;
    if (value.AccountReceivableOpportunityTrend.toFixed(1) < 0) {
      AccountReceivableOpportunityTrendValue = value.AccountReceivableOpportunityTrend.toFixed(1) + '%';
    } else if (value.AccountReceivableOpportunityTrend.toFixed(1) > 0) {
      AccountReceivableOpportunityTrendValue = '+' + value.AccountReceivableOpportunityTrend.toFixed(1) + '%';
    } else {
      AccountReceivableOpportunityTrendValue = AccountReceivableOpportunityTrendValue = '0%*';
    }
    const summaryItems = [
      {
        category: 'app-card',
        type: 'donutWithSideBottomLabel',
        title: 'Medical Records Requested by UHC',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
        data: {
          graphValues: [value.MedicalRecordsRequested, value.ClaimSubmitted],
          centerNumber: Math.round(value.MedicalRecordsRequestedRate * 100) + '%',
          centerData: 'of Claims Submitted',
          color: ['#3381FF', '#D7DCE1'],
          gdata: ['card-inner', 'totalClaimsSubmitted'],
          sdata: {
            sign: medicalRecordsRequestedbyUHCTrendSign,
            data: value.RequestRateTrend.toFixed(1) + '%*'
          },
          labels: ['Records Requested', 'Claims Submitted'],
          hover: true
        },
        besideData: {
          labels: ['Medical Records Requested', 'Claims Submitted'],
          color: ['#3381FF', '#D7DCE1']
        },
        bottomData: {
          horizontalData: [
            {
              labels: '*Positive/negative trend comparision is ' + trendLable
            }
          ]
        },
        status: 200
      },
      {
        title: 'Coding Review Results',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
        data: {
          type: 'bar chart',
          cdata: 'paymentintegrity',
          graphValues: [
            Math.round(value.CodingReviewResultRate * 100),
            100 - Math.round(value.CodingReviewResultRate * 100)
          ],
          barText: 'Accurate Codes',
          hoverData: value.MedicalRecordReviewedWithoutFindings + '/' + value.MedicalRecordsReviewed + ' Reviewed',
          barValue: Math.round(value.CodingReviewResultRate * 100) + '%',
          color: ['#00B8CC', '#FFFFFF', '#E0E0E0'],
          gdata: ['app-card-structure', 'pi-bar-chart'],
          hover: true,
          targetValue: codingReviewResultsTargetValue,
          target: codingReviewResultsTarget
        },
        status: 200
      },
      {
        title: 'Medical Records Received vs. Awaiting Submission',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
        data: {
          type: 'large bar chart',
          cdata: 'paymentintegrity',
          graphValues: [
            Math.round(value.MedicalRecordsReceivedRate * 100),
            Math.round(value.MedicalRecordsNotReceivedRate * 100)
          ],
          barText: 'Records Received',
          hoverData: value.MedicalRecordsReceived + '/' + value.MedicalRecordsRequested + ' Requested',
          color: ['#00B8CC', '#FFFFFF', '#E91B18'],
          gdata: ['app-card-structure', 'pi-large-bar-chart'],
          hover: true,
          targetValue: mRRASTargetValue,
          trendValue: AccountReceivableOpportunityTrendValue,
          target: mRRASTarget,
          AccountsReceivableOpportunity: this.valueFormatting(value.MedicalRecordsNotReceivedAmount),
          trendComparisionLable: '*Positive/negative trend comparison is ' + trendLable
        },
        timeperiod: this.session.filterObjValue.timeFrame,
        status: 200
      }
    ];
    return summaryItems;
  }
  // value formating to include K instead of the whole number
  valueFormatting(value: any) {
    return Math.abs(value) > 999 ? '$' + (Math.abs(value) / 1000).toFixed(0) + 'K' : '$' + Math.abs(value);
  }
  // trendComparisionLable date formating
  trendDateFormatting(value: any) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const split = value.split('-');
    return monthNames[parseInt(split[1]) - 1] + ' ' + split[0];
  }
  // PI data error handling
  piDataError(value: any) {
    if (!value) {
      const summaryItems = [
        {
          category: 'app-card',
          title: 'Medical Records Requested by UHC',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
          status: 500
        },
        {
          category: 'app-card',
          title: 'Coding Review Results',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
          status: 500
        },
        {
          category: 'large-card',
          title: 'Medical Records Received vs. Awaiting Submission',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
          status: 500
        }
      ];
      return summaryItems;
    } else if (value.error) {
      const summaryItems = [
        {
          category: 'app-card',
          title: 'Medical Records Requested by UHC',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
          status: value.status
        },
        {
          category: 'app-card',
          title: 'Coding Review Results',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
          status: value.status
        },
        {
          category: 'large-card',
          title: 'Medical Records Received vs. Awaiting Submission',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
          status: value.status
        }
      ];
      return summaryItems;
    } else {
      const summaryItems = [
        {
          category: 'app-card',
          title: 'Medical Records Requested by UHC',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
          status: 500
        },
        {
          category: 'app-card',
          title: 'Coding Review Results',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
          status: 500
        },
        {
          category: 'large-card',
          title: 'Medical Records Received vs. Awaiting Submission',
          MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
          status: 500
        }
      ];
      return summaryItems;
    }
  }
}
