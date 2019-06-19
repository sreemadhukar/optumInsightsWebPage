/* @author gmounika */
import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';

@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  private overviewPageData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  constructor(
    private overviewService: OverviewService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}
  public getOverviewData() {
    this.timeFrame = this.session.timeFrame;
    this.providerKey = this.session.providerKey();
    this.overviewPageData = [];
    return new Promise(resolve => {
      let cPriorAuth: object;
      let cSelfService: object;
      let cPcor: object;
      let cIR: object;
      let claimsPaid: object;
      let claimsYield: object;
      let parameters;
      const oppurtunities: Array<object> = [];
      const tempArray: Array<object> = [];
      if (this.timeFrame === 'Last 12 Months') {
        parameters = [this.providerKey, true];
      } else {
        // this.session.timeFrame = this.timeFrame = 'Last 12 Months';
        this.timeFrame = 'Last 12 Months';
        parameters = [this.providerKey, true];
      }
      this.overviewService.getOverviewData(...parameters).subscribe(([providerSystems, claims]) => {
        console.log('providerSystem', providerSystems);
        if (
          providerSystems.hasOwnProperty('PriorAuth') &&
          providerSystems.PriorAuth !== null &&
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
          const approvedRate = providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthApprovedCount / priorAuthRequested;

          cPriorAuth = {
            category: 'small-card',
            type: 'donut',
            title: 'Prior Authorization Approval',
            toggle: this.toggle.setToggles('Prior Authorization Approval', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [approvedRate, 1 - approvedRate],
              centerNumber: (approvedRate * 100).toFixed(0) + '%',
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'priorAuthCardD3Donut']
            },
            sdata: {
              sign: 'up',
              data: '+1%'
            },
            timeperiod: 'Last 6 Months'
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
          providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
          providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('Utilizations') &&
          providerSystems.SelfServiceInquiries.ALL.Utilizations.hasOwnProperty('OverallLinkAdoptionRate')
        ) {
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: 'Self Service Adoption Rate',
            toggle: this.toggle.setToggles('Self Service Adoption Rate', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [
                providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate,
                1 - providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate
              ],
              centerNumber:
                (providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0) + '%',
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'selfServiceCardD3Donut']
            },
            sdata: {
              sign: 'down',
              data: '-1.3%'
            },
            timeperiod: 'Last 6 Months'
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
          providerSystems &&
          providerSystems.PatientCareOpportunity != null &&
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
            toggle: this.toggle.setToggles('Medicare Star Rating', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [
                providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(2)
              ],
              centerNumber: providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(
                2
              ),
              color: ['#00A8F7', '#D7DCE1', '#FFFFFF'],
              gdata: ['card-inner', 'pcorCardD3Star']
            },
            sdata: null,
            timeperiod: 'Last 6 Months'
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
        try {
          if (
            providerSystems.hasOwnProperty('ResolvingIssues') &&
            providerSystems.ResolvingIssues != null &&
            providerSystems.ResolvingIssues.Calls != null &&
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
              toggle: this.toggle.setToggles('Total Calls', 'AtGlance', 'Overview', false),
              data: {
                graphValues: [
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Claims,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.BenefitsEligibility,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.PriorAuth,
                  providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Others
                ],
                centerNumber: this.common.nFormatter(providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Total),
                color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                gdata: ['card-inner', 'callsCardD3Donut']
              },
              sdata: {
                sign: 'up',
                data: '+2.3%'
              },
              timeperiod: 'Last 6 Months'
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
        } catch (Error) {
          console.log('Overview Page Total Calls Error ', Error);
          cIR = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        } // ent try catch for Total Calls
        if (
          providerSystems.hasOwnProperty('SelfServiceInquiries') &&
          providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
          providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')
        ) {
          try {
            oppurtunities.push({
              category: 'mini-tile',
              title: 'Reduce Calls and Operating Costs by:',
              toggle: this.toggle.setToggles(
                'Reduce Calls and Operating Costs by:',
                'Opportunities',
                'Overview',
                false
              ),
              data: {
                centerNumber:
                  '$' +
                  this.common.nFormatter(providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallCost.toFixed(2)),
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [
                  providerSystems.SelfServiceInquiries.ALL.SelfService.TotalSelfServiceCost.toFixed(),
                  providerSystems.SelfServiceInquiries.ALL.SelfService.TotalPhoneCost.toFixed()
                ],
                concatString: '$',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Transaction Costs',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'totalCallCost']
              }
            });
          } catch (Error) {
            console.log('Overview Page, Self Service, Data not found for Calls and Operating Cost');
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
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
          try {
            oppurtunities.push({
              category: 'mini-tile',
              title: "Save Your Staff's Time by:" + '\n\xa0',
              toggle: this.toggle.setToggles("Save Your Staff's Time by:", 'Opportunities', 'Overview', false),
              data: {
                centerNumber:
                  providerSystems.SelfServiceInquiries.ALL.SelfService.TotalCallTime.toFixed(0) + ' Hours/day',
                gdata: []
              },
              fdata: {
                type: 'bar chart',
                graphValues: [
                  providerSystems.SelfServiceInquiries.ALL.SelfService.SelfServiceCallTime.toFixed(0),
                  providerSystems.SelfServiceInquiries.ALL.SelfService.PhoneCallTime.toFixed(0)
                ],
                concatString: 'hours',
                color: ['#3381FF', '#FFFFFF', '#80B0FF'],
                graphValuesTitle: 'Avg. Processing Times',
                graphData1: 'for Self Service',
                graphData2: 'for Phone Call',
                gdata: ['card-structure', 'saveStaffTime']
              }
            });
          } catch (Error) {
            console.log('Overview Page, Self Service, Data not found for Save Yours Staff Time');
            oppurtunities.push({
              category: 'mini-tile',
              title: null,
              data: null,
              fdata: null
            });
          }
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
            toggle: this.toggle.setToggles('Reduce Claim Processing Time by:', 'Opportunities', 'Overview', false),
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
              graphValues: [
                providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime.toFixed(0),
                providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime.toFixed(0)
              ],
              concatString: 'Days',
              color: ['#3381FF', '#FFFFFF', '#80B0FF'],
              graphValuesTitle: 'Avg. Processing Times',
              graphData1: 'for Self Service',
              graphData2: 'for Mail',
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
          providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageReconsideredProcessingTime') &&
          providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
          providerSystems.SelfServiceInquiries.ALL.SelfService['AveragePaperReconsideredProcessingTime'] !== null &&
          providerSystems.SelfServiceInquiries.ALL.SelfService['AverageReconsideredProcessingTime'] !== null
        ) {
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Reconsideration Processing by:',
            toggle: this.toggle.setToggles('Reduce Reconsideration Processing by:', 'Opportunities', 'Overview', false),
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
              graphValues: [
                providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime.toFixed(0),
                providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime.toFixed(0)
              ],
              concatString: 'Days',
              color: ['#3381FF', '#FFFFFF', '#80B0FF'],
              graphValuesTitle: 'Avg. Processing Times',
              graphData1: 'for Self Service',
              graphData2: 'for Mail',
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
        console.log('Claims', claims);
        if (
          claims != null &&
          claims.hasOwnProperty('All') &&
          claims.All != null &&
          claims.All.hasOwnProperty('ClaimsLobSummary') &&
          claims.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
          claims.hasOwnProperty('Cs') &&
          claims.Cs.hasOwnProperty('ClaimsLobSummary') &&
          claims.Cs.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
          claims.hasOwnProperty('Ei') &&
          claims.Ei.hasOwnProperty('ClaimsLobSummary') &&
          claims.Ei.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid') &&
          claims.hasOwnProperty('Mr') &&
          claims.Mr.hasOwnProperty('ClaimsLobSummary') &&
          claims.Mr.ClaimsLobSummary[0].hasOwnProperty('ClaimsPaid')
        ) {
          const mrPercentage = claims.Mr.ClaimsLobSummary[0].ClaimsPaid;
          const eiPercentage = claims.Ei.ClaimsLobSummary[0].ClaimsPaid;
          const csPercentage = claims.Cs.ClaimsLobSummary[0].ClaimsPaid;
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Paid',
            toggle: this.toggle.setToggles('Claims Paid', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [mrPercentage, csPercentage, eiPercentage],
              centerNumber: '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].ClaimsPaid),
              color: ['#3381FF', '#80B0FF', '#003DA1'],
              gdata: ['card-inner', 'claimsPaidCardD3Donut']
            },
            sdata: {
              sign: 'down',
              data: '-2.8%'
            },
            timeperiod: 'Last 6 Months'
          };
          // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
          if (!mrPercentage && !eiPercentage && !csPercentage) {
            claimsPaid = {
              category: 'small-card',
              type: 'donut',
              title: 'Claims Paid',
              toggle: this.toggle.setToggles('Claims Paid', 'AtGlance', 'Overview', false),
              data: {
                graphValues: [0, 100],
                centerNumber: '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].ClaimsPaid),
                color: ['#D7DCE1', '#D7DCE1'],
                gdata: ['card-inner', 'claimsPaidCardD3Donut']
              },
              labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
              hover: true,
              sdata: {
                sign: 'down',
                data: '-2.8%'
              },
              timeperiod: 'Last 6 Months'
            };
          }
          // Date: 31/5/2019
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
          claims != null &&
          claims.hasOwnProperty('All') &&
          claims.All != null &&
          claims.All.hasOwnProperty('ClaimsLobSummary') &&
          claims.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')
        ) {
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Yield',
            toggle: this.toggle.setToggles('Claims Yield', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [
                claims.All.ClaimsLobSummary[0].ClaimsYieldRate,
                100 - claims.All.ClaimsLobSummary[0].ClaimsYieldRate
              ],
              centerNumber: claims.All.ClaimsLobSummary[0].ClaimsYieldRate.toFixed() + '%',
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'claimsYieldCardD3Donut']
            },
            sdata: {
              sign: 'up',
              data: '+2.3%'
            },
            timeperiod: 'Last 6 Months'
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
      }); // end subscribing to REST call
    }); // ends Promise
  } // end getOverviewData function
} // end export class
