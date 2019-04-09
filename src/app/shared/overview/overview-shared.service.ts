/* @author gmounika */
import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { ArrayType } from '@angular/compiler';

@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  private overviewPageData: Array<object> = [];
  constructor(private overviewService: OverviewService) {}
  public nFormatter(fnumber) {
    if (fnumber >= 1000000000) {
      return (fnumber / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (fnumber >= 1000000) {
      return (fnumber / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (fnumber >= 1000) {
      return (fnumber / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return fnumber;
  }
  public getOverviewData() {
    return new Promise(resolve => {
      let cPriorAuth: object;
      let cSelfService: object;
      let cPcor: object;
      let cIR: object;
      let claimsPaid: object;
      let claimsYield: object;
      const oppurtunities: Array<object> = [];
      const tempArray: Array<object> = [];
      this.overviewService.combined.subscribe(([data, data1]) => {
        if (
          data.hasOwnProperty('PriorAuth') &&
          data.PriorAuth.hasOwnProperty('LineOfBusiness') &&
          data.PriorAuth.LineOfBusiness.hasOwnProperty('All') &&
          data.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthApprovedCount') &&
          data.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthNotApprovedCount') &&
          data.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthPendingCount') &&
          data.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthCancelledCount')
        ) {
          const priorAuthRequested =
            data.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount +
            data.PriorAuth.LineOfBusiness.All.PriorAuthNotApprovedCount +
            data.PriorAuth.LineOfBusiness.All.PriorAuthPendingCount +
            data.PriorAuth.LineOfBusiness.All.PriorAuthCancelledCount;
          const approvedRate = data.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount / priorAuthRequested;

          cPriorAuth = {
            category: 'small-card',
            type: 'donut',
            title: 'Prior Authorization Approval',
            data: {
              graphValues: [approvedRate, 1 - approvedRate],
              centerNumber: (approvedRate * 100).toFixed(0) + '%',
              color: ['#00A8F7', '#F5F5F5'],
              gdata: ['card-inner', 'priorAuthCardD3Donut']
            },
            sdata: {
              sign: 'up',
              data: '+1%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cPriorAuth = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        if (
          data.hasOwnProperty('SelfServiceInquiries') &&
          data.SelfServiceInquiries.hasOwnProperty('All') &&
          data.SelfServiceInquiries.All.hasOwnProperty('Utilizations') &&
          data.SelfServiceInquiries.All.Utilizations.hasOwnProperty('OverallLinkAdoptionRate')
        ) {
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: 'Self Service Adoption Rate',
            data: {
              graphValues: [
                data.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100,
                1 - data.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100
              ],
              centerNumber: (data.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0) + '%',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: ['card-inner', 'selfServiceCardD3Donut']
            },
            sdata: {
              sign: 'down',
              data: '-1.3%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        if (
          data.hasOwnProperty('PatientCareOpportunity') &&
          data.PatientCareOpportunity.hasOwnProperty('LineOfBusiness') &&
          data.PatientCareOpportunity.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
          data.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AverageStarRating')
        ) {
          cPcor = {
            category: 'small-card',
            type: 'star',
            title: 'Medicare Star Rating',
            data: {
              graphValues: [
                data.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(2)
              ],
              centerNumber: data.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(
                2
              ),
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: ['card-inner', 'pcorCardD3Star']
            },
            sdata: null,
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cPcor = {
            category: 'small-card',
            type: 'star',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        if (
          data.hasOwnProperty('ResolvingIssues') &&
          data.ResolvingIssues.hasOwnProperty('Calls') &&
          data.ResolvingIssues.Calls.hasOwnProperty('CallVolByQuesType') &&
          data.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Total') &&
          data.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Claims') &&
          data.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('BenefitsEligibility') &&
          data.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('PriorAuth') &&
          data.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Others')
        ) {
          cIR = {
            category: 'small-card',
            type: 'donut',
            title: 'Total Calls',
            data: {
              graphValues: [
                data.ResolvingIssues.Calls.CallVolByQuesType.Claims,
                data.ResolvingIssues.Calls.CallVolByQuesType.BenefitsEligibility,
                data.ResolvingIssues.Calls.CallVolByQuesType.PriorAuth,
                data.ResolvingIssues.Calls.CallVolByQuesType.Others
              ],
              centerNumber: this.nFormatter(data.ResolvingIssues.Calls.CallVolByQuesType.Total),
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF', '#00B8CC'],
              gdata: ['card-inner', 'callsCardD3Donut']
            },
            sdata: null,
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cIR = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        if (
          data.hasOwnProperty('SelfServiceInquiries') &&
          data.SelfServiceInquiries.hasOwnProperty('ALL') &&
          data.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')
        ) {
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Calls and Operating Costs by:',
            data: {
              centerNumber: '$' + this.nFormatter(data.SelfServiceInquiries.ALL.SelfService.TotalCallCost.toFixed(2)),
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: ['1.01', '5.40'],
              concatString: '$',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              cValuesTitle: 'Avg. Transaction Costs',
              cValueData1: '$1.01 for Self Service',
              cValueData2: '$5.40 for Phone Call',
              gdata: []
            }
          });
        } else {
          oppurtunities.push({
            category: 'mini-tile',
            title: null,
            data: {
              centerNumber: null,
              gdata: []
            },
            fdata: {
              type: null,
              graphValues: null,
              concatString: null,
              color: null,
              cValuesTitle: null,
              cValueData1: null,
              cValueData2: null,
              gdata: []
            }
          });
        }
        if (
          data.hasOwnProperty('SelfServiceInquiries') &&
          data.SelfServiceInquiries.hasOwnProperty('ALL') &&
          data.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallTime')
        ) {
          oppurtunities.push({
            category: 'mini-tile',
            title: "Save Your Staff's Time by:",
            data: {
              centerNumber: data.SelfServiceInquiries.ALL.SelfService.TotalCallTime.toFixed() + ' Hours/day',
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: ['2', '8'],
              concatString: 'hours',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              cValuesTitle: 'Avg. Processing Times',
              cValueData1: 'for Self Service',
              cValueData2: 'for Phone Call',
              gdata: []
            }
          });
        } else {
          oppurtunities.push({
            category: 'mini-tile',
            title: null,
            data: {
              centerNumber: null,
              gdata: []
            },
            fdata: {
              type: null,
              graphValues: null,
              concatString: null,
              color: null,
              cValuesTitle: null,
              cValueData1: null,
              cValueData2: null,
              gdata: []
            }
          });
        }
        if (
          data.hasOwnProperty('SelfServiceInquiries') &&
          data.SelfServiceInquiries.hasOwnProperty('ALL') &&
          data.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageClaimProcessingTime')
        ) {
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Claim Processing Time by:',
            data: {
              centerNumber:
                (
                  data.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed() -
                  data.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed()
                ).toFixed() + ' Days',
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: ['15', '25'],
              concatString: 'Days',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              cValuesTitle: 'Avg. Processing Times',
              cValueData1: 'for Self Service',
              cValueData2: 'for Phone Call',
              gdata: []
            }
          });
        } else {
          oppurtunities.push({
            category: 'mini-tile',
            title: null,
            data: {
              centerNumber: null,
              gdata: []
            },
            fdata: {
              type: null,
              graphValues: null,
              concatString: null,
              color: null,
              cValuesTitle: null,
              cValueData1: null,
              cValueData2: null,
              gdata: []
            }
          });
        }
        if (
          data.hasOwnProperty('SelfServiceInquiries') &&
          data.SelfServiceInquiries.hasOwnProperty('ALL') &&
          data.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperReconsideredProcessingTime') &&
          data.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageReconsideredProcessingTime')
        ) {
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Reconsideration Processing by:',
            data: {
              centerNumber:
                (
                  data.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed() -
                  data.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed()
                ).toFixed() + ' Days',
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: ['15', '32'],
              concatString: 'Days',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              cValuesTitle: 'Avg. Processing Times',
              cValueData1: 'for Self Service',
              cValueData2: 'for Phone Call',
              gdata: []
            }
          });
        } else {
          oppurtunities.push({
            category: 'mini-tile',
            title: null,
            data: {
              centerNumber: null,
              gdata: []
            },
            fdata: {
              type: null,
              graphValues: null,
              concatString: null,
              color: null,
              cValuesTitle: null,
              cValueData1: null,
              cValueData2: null,
              gdata: []
            }
          });
        }
        if (
          data1.hasOwnProperty('All') &&
          data1.All.hasOwnProperty('ClaimsLobSummary') &&
          data1.All.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
          data1.hasOwnProperty('Cs') &&
          data1.Cs.hasOwnProperty('ClaimsLobSummary') &&
          data1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
          data1.hasOwnProperty('Ei') &&
          data1.Ei.hasOwnProperty('ClaimsLobSummary') &&
          data1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
          data1.hasOwnProperty('Mr') &&
          data1.Mr.hasOwnProperty('ClaimsLobSummary') &&
          data1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid')
        ) {
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Paid',
            data: {
              graphValues: ['mr', 'cs', 'ei'],
              centerNumber: [
                data1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                data1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                data1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid')
              ],
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: ['card-inner', 'claimsPaidCardD3Donut'],
              centerText: '$' + this.nFormatter(data1.All.ClaimsLobSummary[0].AmountUHCPaid)
            },
            sdata: {
              sign: 'down',
              data: '-2.8%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        if (
          data1.hasOwnProperty('All') &&
          data1.All.hasOwnProperty('ClaimsLobSummary') &&
          data1.All.ClaimsLobSummary[0].hasOwnProperty('AmountActualAllowed') &&
          data1.All.ClaimsLobSummary[0].hasOwnProperty('AmountExpectedAllowed')
        ) {
          const actualAllowed = parseFloat(data1.All.ClaimsLobSummary[0].AmountActualAllowed);
          const expectedAllowed = parseFloat(data1.All.ClaimsLobSummary[0].AmountExpectedAllowed);
          const claimYieldDonut = (actualAllowed / expectedAllowed) * 100;
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Yield',
            data: {
              graphValues: ['Approved', 'Not Approved'],
              centerNumber: [100 * claimYieldDonut, 100 - 100 * claimYieldDonut],
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: ['card-inner', 'claimsYieldCardD3Donut'],
              centerText: claimYieldDonut.toFixed() + '%'
            },
            sdata: {
              sign: 'up',
              data: '+2.3%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        tempArray[0] = claimsPaid;
        tempArray[1] = cPriorAuth;
        tempArray[2] = cSelfService;
        tempArray[3] = claimsYield;
        tempArray[4] = cPcor;
        tempArray[5] = cIR;
        this.overviewPageData.push(tempArray, oppurtunities);
        if (this.overviewPageData.length) {
          resolve(this.overviewPageData);
        }
      });
    });
  }
}
