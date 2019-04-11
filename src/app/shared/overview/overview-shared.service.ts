/* @author gmounika */
import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { CommonUtilsService } from '../common-utils.service';
@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  private overviewPageData: Array<object> = [];
  constructor(private overviewService: OverviewService, private common: CommonUtilsService) {}

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
      this.overviewService.combined.subscribe(([providerSystems, claims]) => {
        if (providerSystems.hasOwnProperty('status')) {
          cPriorAuth = {
            category: 'small-card',
            type: 'donut',
            title: providerSystems.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: providerSystems.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
          cPcor = {
            category: 'small-card',
            type: 'star',
            title: providerSystems.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
          cIR = {
            category: 'small-card',
            type: 'donut',
            title: providerSystems.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
          oppurtunities.push(
            {
              category: 'mini-tile',
              title: providerSystems.status,
              data: null,
              fdata: null
            },
            {
              category: 'mini-tile',
              title: providerSystems.status,
              data: null,
              fdata: null
            },
            {
              category: 'mini-tile',
              title: providerSystems.status,
              data: null,
              fdata: null
            },
            {
              category: 'mini-tile',
              title: providerSystems.status,
              data: null,
              fdata: null
            }
          );
        } else {
          if (
            providerSystems.hasOwnProperty('PriorAuth') &&
            providerSystems.PriorAuth.hasOwnProperty('LineOfBusiness') &&
            providerSystems.PriorAuth.LineOfBusiness.hasOwnProperty('All') &&
            providerSystems.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthApprovedCount') &&
            providerSystems.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthNotApprovedCount') &&
            providerSystems.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthPendingCount') &&
            providerSystems.PriorAuth.LineOfBusiness.All.hasOwnProperty('PriorAuthCancelledCount')
          ) {
            const priorAuthRequested =
              providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount +
              providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthNotApprovedCount +
              providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthPendingCount +
              providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthCancelledCount;
            const approvedRate =
              providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount / priorAuthRequested;

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
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('All') &&
            providerSystems.SelfServiceInquiries.All.hasOwnProperty('Utilizations') &&
            providerSystems.SelfServiceInquiries.All.Utilizations.hasOwnProperty('OverallLinkAdoptionRate')
          ) {
            cSelfService = {
              category: 'small-card',
              type: 'donut',
              title: 'Self Service Adoption Rate',
              data: {
                graphValues: [
                  providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100,
                  1 - providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100
                ],
                centerNumber:
                  (providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0) +
                  '%',
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
            providerSystems.hasOwnProperty('PatientCareOpportunity') &&
            providerSystems.PatientCareOpportunity.hasOwnProperty('LineOfBusiness') &&
            providerSystems.PatientCareOpportunity.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
            providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.hasOwnProperty(
              'AverageStarRating'
            )
          ) {
            cPcor = {
              category: 'small-card',
              type: 'star',
              title: 'Medicare Star Rating',
              data: {
                graphValues: [
                  providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(
                    2
                  )
                ],
                centerNumber: providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(
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
            providerSystems.hasOwnProperty('ResolvingIssues') &&
            providerSystems.ResolvingIssues.hasOwnProperty('Calls') &&
            providerSystems.ResolvingIssues.Calls.hasOwnProperty('CallVolByQuesType') &&
            providerSystems.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Total') &&
            providerSystems.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Claims') &&
            providerSystems.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('BenefitsEligibility') &&
            providerSystems.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('PriorAuth') &&
            providerSystems.ResolvingIssues.Calls.CallVolByQuesType.hasOwnProperty('Others')
          ) {
            cIR = {
              category: 'small-card',
              type: 'donut',
              title: 'Total Calls',
              data: {
                graphValues: [
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Claims,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.BenefitsEligibility,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.PriorAuth,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Others
                ],
                centerNumber: this.common.nFormatter(providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Total),
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
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Calls and Operating Costs by:',
              data: {
                centerNumber:
                  '$' +
                  this.common.nFormatter(providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallCost.toFixed(2)),
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [1.01, 5.4],
                concatString: '$',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Transaction Costs',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'totalCallCost']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallTime')
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: "Save Your Staff's Time by:" + '\n\xa0',
              data: {
                centerNumber:
                  providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallTime.toFixed() + ' Hours/day',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [2, 8],
                concatString: 'hours',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'saveStaffTime']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageClaimProcessingTime')
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Claim Processing Time by:',
              data: {
                centerNumber:
                  (
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed() -
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed()
                  ).toFixed() + ' Days',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [15, 25],
                concatString: 'Days',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'reduceClaimProcessingTime']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
          if (
            providerSystems.hasOwnProperty('SelfServiceInquiries') &&
            providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
            providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty(
              'AveragePaperReconsideredProcessingTime'
            ) &&
            providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageReconsideredProcessingTime')
          ) {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Reconsideration Processing by:',
              data: {
                centerNumber:
                  (
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed() -
                    providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed()
                  ).toFixed() + ' Days',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [15, 32],
                concatString: 'Days',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'reduceReconsiderationProcessing']
              }
            });
          } else {
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
        }
        if (claims.hasOwnProperty('status')) {
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            title: claims.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: claims.status,
            data: null,
            sdata: null,
            timeperiod: null
          };
        } else {
          if (
            claims.hasOwnProperty('All') &&
            claims.All.hasOwnProperty('ClaimsLobSummary') &&
            claims.All.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
            claims.hasOwnProperty('Cs') &&
            claims.Cs.hasOwnProperty('ClaimsLobSummary') &&
            claims.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
            claims.hasOwnProperty('Ei') &&
            claims.Ei.hasOwnProperty('ClaimsLobSummary') &&
            claims.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid') &&
            claims.hasOwnProperty('Mr') &&
            claims.Mr.hasOwnProperty('ClaimsLobSummary') &&
            claims.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid')
          ) {
            claimsPaid = {
              category: 'small-card',
              type: 'donut',
              title: 'Claims Paid',
              data: {
                graphValues: [
                  claims.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                  claims.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                  claims.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid')
                ],
                centerNumber: '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountUHCPaid),
                color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
                gdata: ['card-inner', 'claimsPaidCardD3Donut']
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
            claims.hasOwnProperty('All') &&
            claims.All.hasOwnProperty('ClaimsLobSummary') &&
            claims.All.ClaimsLobSummary[0].hasOwnProperty('AmountActualAllowed') &&
            claims.All.ClaimsLobSummary[0].hasOwnProperty('AmountExpectedAllowed')
          ) {
            const actualAllowed = parseFloat(claims.All.ClaimsLobSummary[0].AmountActualAllowed);
            const expectedAllowed = parseFloat(claims.All.ClaimsLobSummary[0].AmountExpectedAllowed);
            const claimYieldDonut = (actualAllowed / expectedAllowed) * 100;
            claimsYield = {
              category: 'small-card',
              type: 'donut',
              title: 'Claims Yield',
              data: {
                graphValues: [claimYieldDonut, 1 - claimYieldDonut],
                centerNumber: claimYieldDonut.toFixed() + '%',
                color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
                gdata: ['card-inner', 'claimsYieldCardD3Donut']
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
