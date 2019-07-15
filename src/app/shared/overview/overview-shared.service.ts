/* @author gmounika */
import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { OverviewPageModule } from '../../components/overview-page/overview-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { CallsTrendService } from './../service-interaction/calls-trend.service';

@Injectable({
  providedIn: OverviewPageModule
})
export class OverviewSharedService {
  private overviewPageData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  private baseTimePeriod = 'Last30Days';
  private previousTimePeriod = 'PreviousLast30Days';
  constructor(
    private overviewService: OverviewService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private callsTrendService: CallsTrendService
  ) {}
  getOverviewData() {
    this.timeFrame = this.session.timeFrame;
    this.providerKey = this.session.providerKeyData();
    this.overviewPageData = [];
    return new Promise(resolve => {
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

        /* code changed by Ranjith kumar Ankam - 04-Jul-2019*/
        this.createPriorAuthObject(providerSystems)
          .then(cPriorAuth => {
            tempArray[1] = cPriorAuth;
            return this.createSelfServiceObject(providerSystems);
          })
          .then(cSelfService => {
            tempArray[2] = cSelfService;
            return this.createPCORObject(providerSystems);
          })
          .then(cPcor => {
            tempArray[4] = cPcor;
            return this.createTotalCallsObject(providerSystems);
          })
          .then(cIR => {
            tempArray[5] = cIR;
            return this.createClaimsPaidObject(claims);
          })
          .then(claimsPaid => {
            tempArray[0] = claimsPaid;
            return this.createClaimsYieldObject(claims);
          })
          .then(claimsYield => {
            tempArray[3] = claimsYield;
            return this.getClaimsTrends(this.baseTimePeriod, this.previousTimePeriod);
          })
          .then(trendData => {
            let trends: any;
            trends = trendData;
            tempArray[0]['sdata'] = trends.claimsPaidTrendObject;
            tempArray[3]['sdata'] = trends.claimsYieldTrendObject;
            return this.createTotalCallsTrend();
          })
          .then(trendIssueResolution => {
            tempArray[5]['sdata'] = trendIssueResolution;
            return this.reduceCallsandOperatingCostsMiniTile(providerSystems, oppurtunities);
          })
          .then(reduceoppurtunities => {
            return this.saveYourStaffsTimeMiniTile(providerSystems, reduceoppurtunities);
          })
          .then(savestaffoppurtunities => {
            return this.reduceClaimsProcessingTimeMiniTile(providerSystems, savestaffoppurtunities);
          })
          .then(reduceclaimsoppurtunities => {
            return this.reduceReconsiderationProcessMiniTile(providerSystems, reduceclaimsoppurtunities);
          })
          .then(totaloppurtunities => {
            this.overviewPageData.push(tempArray, totaloppurtunities);
            resolve(this.overviewPageData);
          });
      }); // end subscribing to REST call
    }); // ends Promise
  } // end getOverviewData function

  /* function to create Prioir Auth Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createPriorAuthObject(providerSystems) {
    return new Promise((resolve, reject) => {
      let cPriorAuth: object;
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
          providerSystems.PriorAuth.LineOfBusiness.All.PriorAuthNotApprovedCount;
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

      resolve(cPriorAuth);
    });
  }

  /* function to create Selef Service Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createSelfServiceObject(providerSystems) {
    return new Promise((resolve, reject) => {
      let cSelfService: object;
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
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
            sign: 'up',
            data: '+1%'
          },
          timeperiod: '90 Days Period'
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
      resolve(cSelfService);
    });
  }

  /* function to create PCOR Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createPCORObject(providerSystems) {
    let cPcor: Object;
    return new Promise((resolve, reject) => {
      if (
        providerSystems &&
        providerSystems.PatientCareOpportunity != null &&
        providerSystems.PatientCareOpportunity.hasOwnProperty('LineOfBusiness') &&
        providerSystems.PatientCareOpportunity.LineOfBusiness.hasOwnProperty('MedicareAndRetirement') &&
        providerSystems.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.hasOwnProperty('AverageStarRating')
      ) {
        const PCORMRdate = providerSystems.PatientCareOpportunity.ReportingPeriod;
        const PCORMRmonth = this.common.generateMonth(parseInt(PCORMRdate.substr(0, 2)) - 1);
        const PCORMRday = parseInt(PCORMRdate.substr(3, 2));
        const PCORMRyear = PCORMRdate.substr(6, 4);
        const PCORRMReportingDate = PCORMRmonth + ' ' + PCORMRday + ', ' + PCORMRyear;
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
          timeperiod: 'Claims Processed as of' + PCORRMReportingDate
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
      resolve(cPcor);
    });
  }

  createTotalCallsTrend() {
    let trendIR: Object;
    return new Promise((resolve, reject) => {
      this.callsTrendService
        .getCallsTrendData()
        .then(data => {
          trendIR = data[0];
          resolve(trendIR);
        })
        .catch(reason => {
          console.log('Calls Service Error ', reason);
        });
    });
  }
  /* function to create Total Calls Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createTotalCallsObject(providerSystems) {
    let cIR: Object;
    return new Promise((resolve, reject) => {
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
            gdata: ['card-inner', 'callsCardD3Donut'],
            hover: true,
            labels: ['Claims', 'Benefits & Eligibility', 'Prior Authorizations', 'Others']
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
      resolve(cIR);
    });
  }

  /* function to create Calls and Operating Costs OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  reduceCallsandOperatingCostsMiniTile(providerSystems, oppurtunities) {
    return new Promise((resolve, reject) => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost')
      ) {
        try {
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Calls and Operating Costs by:',
            toggle: this.toggle.setToggles('Reduce Calls and Operating Costs by:', 'Opportunities', 'Overview', false),
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
      resolve(oppurtunities);
    });
  }

  /* function to create Save Your Staff's Time OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  saveYourStaffsTimeMiniTile(providerSystems, oppurtunities) {
    return new Promise((resolve, reject) => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
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
      resolve(oppurtunities);
    });
  }

  /* function to create Reduce Claims Processing Time OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  reduceClaimsProcessingTimeMiniTile(providerSystems, oppurtunities) {
    return new Promise((resolve, reject) => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL != null &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService != null &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperClaimProcessingTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperClaimProcessingTime != null &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageClaimProcessingTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.AverageClaimProcessingTime != null
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
      resolve(oppurtunities);
    });
  }

  /* function to create Reduce Reconsideration Process OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  reduceReconsiderationProcessMiniTile(providerSystems, oppurtunities) {
    return new Promise((resolve, reject) => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL != null &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService != null &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AveragePaperReconsideredProcessingTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('AverageReconsideredProcessingTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.AveragePaperReconsideredProcessingTime !== null &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.AverageReconsideredProcessingTime !== null
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
      resolve(oppurtunities);
    });
  }

  /* function to create Claims Paid in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createClaimsPaidObject(claims) {
    let claimsPaid: Object;
    return new Promise((resolve, reject) => {
      if (
        claims != null &&
        claims.hasOwnProperty('All') &&
        claims.All != null &&
        claims.All.hasOwnProperty('ClaimsLobSummary')
      ) {
        if (
          claims.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
          claims.hasOwnProperty('Cs') &&
          claims.Cs.hasOwnProperty('ClaimsLobSummary') &&
          claims.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
          claims.hasOwnProperty('Ei') &&
          claims.Ei.hasOwnProperty('ClaimsLobSummary') &&
          claims.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid') &&
          claims.hasOwnProperty('Mr') &&
          claims.Mr.hasOwnProperty('ClaimsLobSummary') &&
          claims.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
        ) {
          const mrPercentage = claims.Mr.ClaimsLobSummary[0].AmountPaid;
          const eiPercentage = claims.Ei.ClaimsLobSummary[0].AmountPaid;
          const csPercentage = claims.Cs.ClaimsLobSummary[0].AmountPaid;
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Paid',
            toggle: this.toggle.setToggles('Claims Paid', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [mrPercentage, csPercentage, eiPercentage],
              centerNumber:
                this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
                this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) > 0
                  ? '< $1'
                  : '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid),
              color: ['#3381FF', '#80B0FF', '#003DA1'],
              gdata: ['card-inner', 'claimsPaidCardD3Donut'],
              labels: ['Medicare & Retirement', 'Community & State', 'Employer & Individual'],
              hover: true
            },
            // sdata: claimsTrendObject,
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
                centerNumber:
                  this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
                  this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) > 0
                    ? '< $1'
                    : '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid),
                color: ['#D7DCE1', '#D7DCE1'],
                gdata: ['card-inner', 'claimsPaidCardD3Donut']
              },
              // sdata: claimsTrendObject,
              timeperiod: 'Last 6 Months'
            };
          }
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
      resolve(claimsPaid);
    });
  }

  /* function to create Claims Yield Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createClaimsYieldObject(claims) {
    let claimsYield: Object;
    return new Promise((resolve, reject) => {
      if (
        claims != null &&
        claims.hasOwnProperty('All') &&
        claims.All != null &&
        claims.All.hasOwnProperty('ClaimsLobSummary')
      ) {
        if (claims.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
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
            // sdata: claimsYieldTrendObject,
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
      resolve(claimsYield);
    });
  }

  /* function to calculate Claims Paid & Claims YIeld Rate TRENDS -  Ranjith kumar Ankam - 04-Jul-2019*/
  getClaimsTrends(baseTimePeriod, previousTimePeriod) {
    return new Promise((resolve, reject) => {
      /************************TRENDS********* */
      let parameters = {
        providerkey: this.providerKey,
        // TimeFilter: 'Last30Days'
        TimeFilter: baseTimePeriod
      };
      let latestClaimsPaid;
      let latestClaimsYieldRate;
      let previousClaimsPaid;
      let previousClaimsYieldRate;
      let claimsTrendValue;
      const claimsPaidTrendObject: any = {};
      let claimsYieldTrendValue;
      const claimsYieldTrendObject: any = {};

      this.getCurrentClaimsTrend(parameters)
        .then(r => {
          const latestClaimsTrendData: any = r;
          latestClaimsPaid = latestClaimsTrendData.latestClaimsPaid;
          latestClaimsYieldRate = latestClaimsTrendData.latestClaimsYieldRate;
          parameters = {
            providerkey: this.providerKey,
            // TimeFilter: 'PreviousLast30Days'
            TimeFilter: previousTimePeriod
          };
          return this.getPreviousClaimsTrend(parameters);
        })
        .then(r => {
          const previousClaimsTrendData: any = r;
          previousClaimsPaid = previousClaimsTrendData.previousClaimsPaid;
          previousClaimsYieldRate = previousClaimsTrendData.previousClaimsYieldRate;
          console.log(latestClaimsPaid, previousClaimsPaid, latestClaimsYieldRate, previousClaimsYieldRate);
          if (latestClaimsPaid !== 0 && latestClaimsPaid !== '0' && latestClaimsPaid != undefined) {
            if (latestClaimsPaid === previousClaimsPaid) {
              claimsPaidTrendObject.sign = '';
              claimsPaidTrendObject.data = '';
            } else if (previousClaimsPaid != undefined) {
              claimsTrendValue = ((latestClaimsPaid - previousClaimsPaid) / previousClaimsPaid) * 100;
              if (claimsTrendValue >= 0) {
                claimsPaidTrendObject.sign = 'up';
                claimsPaidTrendObject.data = '+' + claimsTrendValue.toFixed(1) + '%';
              } else {
                claimsPaidTrendObject.sign = 'down';
                claimsPaidTrendObject.data = claimsTrendValue.toFixed(1) + '%';
              }
            } else {
              claimsPaidTrendObject.sign = 'up';
              claimsPaidTrendObject.data = '+' + latestClaimsPaid + '%';
            }
          } else if (previousClaimsPaid !== 0 || previousClaimsPaid !== '0' || previousClaimsPaid != undefined) {
            if (latestClaimsPaid != undefined) {
              claimsTrendValue = ((latestClaimsPaid - previousClaimsPaid) / previousClaimsPaid) * 100;
              if (claimsTrendValue >= 0) {
                claimsPaidTrendObject.sign = 'up';
                claimsPaidTrendObject.data = '+' + claimsTrendValue.toFixed(1) + '%';
              } else {
                claimsPaidTrendObject.sign = 'down';
                claimsPaidTrendObject.data = claimsTrendValue.toFixed(1) + '%';
              }
            }
          } else {
            claimsPaidTrendObject.sign = '';
            claimsPaidTrendObject.data = '';
          }

          if (latestClaimsYieldRate !== 0 && latestClaimsYieldRate !== '0' && latestClaimsYieldRate != undefined) {
            if (latestClaimsYieldRate === previousClaimsYieldRate) {
              claimsYieldTrendObject.sign = '';
              claimsYieldTrendObject.data = '';
            } else if (previousClaimsYieldRate != undefined) {
              claimsYieldTrendValue =
                ((latestClaimsYieldRate - previousClaimsYieldRate) / previousClaimsYieldRate) * 100;
              if (claimsYieldTrendValue >= 0) {
                claimsYieldTrendObject.sign = 'up';
                claimsYieldTrendObject.data = '+' + claimsYieldTrendValue.toFixed(1) + '%';
              } else {
                claimsYieldTrendObject.sign = 'down';
                claimsYieldTrendObject.data = claimsYieldTrendValue.toFixed(1) + '%';
              }
            } else {
              claimsYieldTrendObject.sign = 'up';
              claimsYieldTrendObject.data = '+' + latestClaimsYieldRate + '%';
            }
          } else if (
            previousClaimsYieldRate !== 0 ||
            previousClaimsYieldRate !== '0' ||
            previousClaimsYieldRate != undefined
          ) {
            if (latestClaimsYieldRate != undefined) {
              claimsYieldTrendValue =
                ((latestClaimsYieldRate - previousClaimsYieldRate) / previousClaimsYieldRate) * 100;
              if (claimsYieldTrendValue >= 0) {
                claimsYieldTrendObject.sign = 'up';
                claimsYieldTrendObject.data = '+' + claimsYieldTrendValue.toFixed(1) + '%';
              } else {
                claimsYieldTrendObject.sign = 'down';
                claimsYieldTrendObject.data = claimsYieldTrendValue.toFixed(1) + '%';
              }
            }
          } else {
            claimsYieldTrendObject.sign = '';
            claimsYieldTrendObject.data = '';
          }

          /*
                    if (
                      latestClaimsYieldRate !== 0 &&
                      previousClaimsYieldRate !== 0 &&
                      latestClaimsYieldRate !== '0' &&
                      previousClaimsYieldRate !== '0' &&
                      latestClaimsYieldRate != undefined &&
                      previousClaimsYieldRate != undefined
                    ) {
                      claimsYieldTrendValue = ((latestClaimsYieldRate - previousClaimsYieldRate) / previousClaimsYieldRate) * 100;
                      if (claimsYieldTrendValue >= 0) {
                        claimsYieldTrendObject.sign = 'up';
                        claimsYieldTrendObject.data = '+' + claimsYieldTrendValue.toFixed(1) + '%';
                      } else {
                        claimsYieldTrendObject.sign = 'down';
                        claimsYieldTrendObject.data = claimsYieldTrendValue.toFixed(1) + '%';
                      }
                    } else if (
                      previousClaimsYieldRate === 0 ||
                      previousClaimsYieldRate === '0' ||
                      previousClaimsYieldRate == undefined ||
                      previousClaimsYieldRate == undefined
                    ) {
                      claimsYieldTrendObject.sign = 'up';
                      claimsYieldTrendObject.data = '+' + latestClaimsYieldRate + '%';
                    }
          */
          resolve({ claimsPaidTrendObject: claimsPaidTrendObject, claimsYieldTrendObject: claimsYieldTrendObject });
        });
    });
  }

  /* function to get current Claims Paid & Claims YIeld Rate TRENDS -  Ranjith kumar Ankam - 04-Jul-2019*/
  getCurrentClaimsTrend(parameters) {
    let latestClaimsPaid;
    let latestClaimsYieldRate;
    return new Promise((resolve, reject) => {
      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claimsTrendLatestData => {
        if (
          claimsTrendLatestData != null &&
          claimsTrendLatestData.hasOwnProperty('All') &&
          claimsTrendLatestData.All != null &&
          claimsTrendLatestData.All.hasOwnProperty('ClaimsLobSummary')
        ) {
          if (claimsTrendLatestData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
            // latestClaimsPaid = this.common.nFormatter(claimsTrendLatestData.All.ClaimsLobSummary[0].AmountPaid);
            latestClaimsPaid = claimsTrendLatestData.All.ClaimsLobSummary[0].AmountPaid;
          }
          if (claimsTrendLatestData.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
            // latestClaimsYieldRate = this.common.nFormatter(claimsTrendLatestData.All.ClaimsLobSummary[0].ClaimsYieldRate);
            latestClaimsYieldRate = claimsTrendLatestData.All.ClaimsLobSummary[0].ClaimsYieldRate;
          }
        }

        resolve({ latestClaimsPaid: latestClaimsPaid, latestClaimsYieldRate: latestClaimsYieldRate });
      });
    });
  }

  /* function to get previous Claims Paid & Claims YIeld Rate TRENDS -  Ranjith kumar Ankam - 04-Jul-2019*/
  getPreviousClaimsTrend(parameters) {
    let previousClaimsPaid;
    let previousClaimsYieldRate;
    return new Promise((resolve, reject) => {
      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claimsTrendPreviousData => {
        if (
          claimsTrendPreviousData != null &&
          claimsTrendPreviousData.hasOwnProperty('All') &&
          claimsTrendPreviousData.All != null &&
          claimsTrendPreviousData.All.hasOwnProperty('ClaimsLobSummary')
        ) {
          if (claimsTrendPreviousData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
            // previousClaimsPaid = this.common.nFormatter(claimsTrendPreviousData.All.ClaimsLobSummary[0].AmountPaid);
            previousClaimsPaid = claimsTrendPreviousData.All.ClaimsLobSummary[0].AmountPaid;
          }
          if (claimsTrendPreviousData.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
            // previousClaimsYieldRate = this.common.nFormatter(claimsTrendPreviousData.All.ClaimsLobSummary[0].ClaimsYieldRate);
            previousClaimsYieldRate = claimsTrendPreviousData.All.ClaimsLobSummary[0].ClaimsYieldRate;
          }
        }

        resolve({ previousClaimsPaid: previousClaimsPaid, previousClaimsYieldRate: previousClaimsYieldRate });
      });
    });
  }
} // end export class
