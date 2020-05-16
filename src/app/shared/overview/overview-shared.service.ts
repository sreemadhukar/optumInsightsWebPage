/* @author gmounika */
import { Injectable } from '@angular/core';
import { OverviewService } from '../../rest/overview/overview.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { TrendingMetricsService } from '../../rest/trending/trending-metrics.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { lobName } from '../../modals/lob-name';
import { ICallsResponse } from 'src/app/modals/i-calls';

@Injectable({
  providedIn: 'root'
})
export class OverviewSharedService {
  private overviewPageData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  private baseTimePeriod = 'Last6Months';
  private previousTimePeriod = 'PreviousLast6Months';
  constructor(
    private MetricidService: GlossaryMetricidService,
    private overviewService: OverviewService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService,
    private trendsService: TrendingMetricsService
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
        this.timeFrame = 'Last 12 Months';
        parameters = [this.providerKey, true];
      }

      this.overviewService.getOverviewData(...parameters).subscribe(([providerSystems, {}, EDI, PAPER]) => {
        this.createSelfServiceObject(providerSystems)
          .then(cSelfService => {
            tempArray[0] = cSelfService;
            return this.createPCORObject(providerSystems);
          })
          .then(cPcor => {
            tempArray[1] = cPcor;
            return this.reduceCallsandOperatingCostsMiniTile(providerSystems, oppurtunities);
          })
          .then(reduceoppurtunities => {
            return this.saveYourStaffsTimeMiniTile(providerSystems, reduceoppurtunities);
          })
          .then(savestaffoppurtunities => {
            return this.reduceClaimsProcessingTimeMiniTile(EDI, PAPER, savestaffoppurtunities);
          })
          .then(reduceclaimsoppurtunities => {
            return this.reduceReconsiderationProcessMiniTile(providerSystems, reduceclaimsoppurtunities);
          })
          .then(totaloppurtunities => {
            this.overviewPageData.push(tempArray, totaloppurtunities);
            resolve(this.overviewPageData);
          })
          .catch(err => {
            console.log(err);
          });
      }); // end subscribing to REST call
    }); // ends Promise
  } // end getOverviewData function
  /* function to create Selef Service Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createSelfServiceObject(providerSystems) {
    return new Promise(resolve => {
      let cSelfService: object;
      let timeSelfService: string;
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodStartDate') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodEndDate')
      ) {
        try {
          const startDate: string = this.common.dateFormat(
            providerSystems.SelfServiceInquiries.ALL.ReportingPeriodStartDate
          );
          const endDate: string = this.common.dateFormat(
            providerSystems.SelfServiceInquiries.ALL.ReportingPeriodEndDate
          );
          timeSelfService = startDate + '&ndash;' + endDate;
        } catch (Error) {
          timeSelfService = null;
          console.log('Error in Self Service TimePeriod', timeSelfService);
        }
      } else {
        timeSelfService = null;
      }
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('Utilizations') &&
        providerSystems.SelfServiceInquiries.ALL.Utilizations.hasOwnProperty('OverallLinkAdoptionRate') &&
        providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate !== null
      ) {
        let selfServiceTime;
        if (
          providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodStartDate') &&
          providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('ReportingPeriodEndDate')
        ) {
          try {
            const startDate: string = this.common.dateFormat(
              providerSystems.SelfServiceInquiries.ALL.ReportingPeriodStartDate
            );
            const endDate: string = this.common.dateFormat(
              providerSystems.SelfServiceInquiries.ALL.ReportingPeriodEndDate
            );
            selfServiceTime = startDate + '&ndash;' + endDate;
          } catch (Error) {
            selfServiceTime = null;
            console.log('Error in Overview | Self Service TimePeriod', Error);
          }
        } else {
          selfServiceTime = null;
        }
        try {
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: 'Self Service Adoption Rate',
            MetricID: this.MetricidService.MetricIDs.SelfServiceAdoptionRate,
            toggle: this.toggle.setToggles('Self Service Adoption Rate', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [
                providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate,
                1 - providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate
              ],
              centerNumber:
                providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100 < 1 &&
                providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100 > 0
                  ? '< 1%'
                  : (providerSystems.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0) +
                    '%',
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'selfServiceCardD3Donut']
            },
            sdata: null,
            timeperiod: selfServiceTime
          };
        } catch (Error) {
          console.log('Overview page Error | Self Service Adoption Rate', Error);
          cSelfService = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
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
    return new Promise(resolve => {
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
          subtitle: 'Health System Summary',
          MetricID: this.MetricidService.MetricIDs.MedicareStarRating,
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
          timeperiod: 'Claims processed as of ' + PCORRMReportingDate
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
  /* function to create Total Calls Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  createTotalCallsObject(providerSystems) {
    let cIR: Object;
    return new Promise(resolve => {
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
          title: 'Calls By Call Type',
          MetricID: this.MetricidService.MetricIDs.CallsbyCallType,
          toggle: this.toggle.setToggles('Total Calls', 'AtGlance', 'Overview', false),
          data: {
            graphValues: [
              providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Claims,
              providerSystems.ResolvingIssues.Calls.CallVolByQuesType.BenefitsEligibility,
              providerSystems.ResolvingIssues.Calls.CallVolByQuesType.PriorAuth,
              providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Others
            ],
            centerNumber: this.common.nondecimalFormatter(
              providerSystems.ResolvingIssues.Calls.CallVolByQuesType.Total
            ),
            color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
            gdata: ['card-inner', 'callsCardD3Donut'],
            hover: true,
            labels: ['Claims', 'Eligibilty and Benefits', 'Prior Authorizations', 'Others']
          },
          sdata: null,
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
    return new Promise(resolve => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallCost') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalSelfServiceCost') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalPhoneCost')
      ) {
        try {
          const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
          const totalCallCost: number = selfService.TotalCallCost;
          oppurtunities.push({
            category: 'mini-tile',
            title: 'Reduce Calls and Operating Costs by:',
            MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
            toggle:
              this.toggle.setToggles(
                'Reduce Calls and Operating Costs by:',
                'Self Service',
                'Service Interaction',
                false
              ) && this.common.checkZeroNegative(totalCallCost),
            data: {
              centerNumber: '$' + this.common.nFormatter(totalCallCost),
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: [selfService.TotalSelfServiceCost, selfService.TotalPhoneCost],
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
            title: 'Reduce Calls and Operating Costs by:',
            MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
            status: null,
            data: null,
            fdata: null
          });
        }
      } else {
        oppurtunities.push({
          category: 'mini-tile',
          title: 'Reduce Calls and Operating Costs by:',
          MetricID: this.MetricidService.MetricIDs.ReduceCallsOperatingCostsBy,
          status: null,
          data: null,
          fdata: null
        });
      }
      resolve(oppurtunities);
    });
  }
  /* function to create Save Your Staff's Time OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  saveYourStaffsTimeMiniTile(providerSystems, oppurtunities) {
    return new Promise(resolve => {
      if (
        providerSystems.hasOwnProperty('SelfServiceInquiries') &&
        providerSystems.SelfServiceInquiries != null &&
        providerSystems.SelfServiceInquiries.hasOwnProperty('ALL') &&
        providerSystems.SelfServiceInquiries.ALL.hasOwnProperty('SelfService') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('TotalCallTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('SelfServiceCallTime') &&
        providerSystems.SelfServiceInquiries.ALL.SelfService.hasOwnProperty('PhoneCallTime')
      ) {
        try {
          const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
          oppurtunities.push({
            category: 'mini-tile',
            title: "Save Your Staff's Time by:" + '\n\xa0',
            MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
            toggle:
              this.toggle.setToggles("Save Your Staff's Time by:", 'Self Service', 'Service Interaction', false) &&
              this.common.checkZeroNegative(selfService.TotalCallTime),
            data: {
              centerNumber:
                (selfService.TotalCallTime < 1 ? '< 1' : this.common.nondecimalFormatter(selfService.TotalCallTime)) +
                (selfService.TotalCallTime <= 1 ? ' Hour/day' : ' Hours/day'),
              gdata: []
            },
            fdata: {
              type: 'bar chart',
              graphValues: [selfService.SelfServiceCallTime, selfService.PhoneCallTime],
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
            title: "Save Your Staff's Time by:" + '\n\xa0',
            MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
            status: null,
            data: null,
            fdata: null
          });
        }
      } else {
        oppurtunities.push({
          category: 'mini-tile',
          title: "Save Your Staff's Time by:" + '\n\xa0',
          MetricID: this.MetricidService.MetricIDs.SaveyourStaffsTimeBy,
          status: null,
          data: null,
          fdata: null
        });
      }
      resolve(oppurtunities);
    });
  }

  reduceClaimsProcessingTimeMiniTile(EDI, PAPER, oppurtunities) {
    return new Promise(resolve => {
      if (
        EDI &&
        PAPER &&
        EDI.hasOwnProperty('All') &&
        EDI.All != null &&
        EDI.All.hasOwnProperty('ClaimsLobSummary') &&
        EDI.All.ClaimsLobSummary.length &&
        EDI.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat') &&
        EDI.All.ClaimsLobSummary[0].ClaimsAvgTat != null &&
        PAPER.hasOwnProperty('All') &&
        PAPER.All != null &&
        PAPER.All.hasOwnProperty('ClaimsLobSummary') &&
        PAPER.All.ClaimsLobSummary.length &&
        PAPER.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat') &&
        PAPER.All.ClaimsLobSummary[0].ClaimsAvgTat != null
      ) {
        const ediClaimsLobSummary = EDI.All.ClaimsLobSummary[0];
        const paperClaimsLobSummary = PAPER.All.ClaimsLobSummary[0];
        const checkProcessingTime =
          paperClaimsLobSummary.ClaimsAvgTat.toFixed(0) - ediClaimsLobSummary.ClaimsAvgTat.toFixed(0);
        oppurtunities.push({
          category: 'mini-tile',
          title: 'Reduce Claim Processing Time by:',
          MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
          toggle:
            this.common.checkZeroNegative(checkProcessingTime) &&
            this.toggle.setToggles('Reduce Claim Processing Time by:', 'Self Service', 'Service Interaction', false) &&
            this.common.checkZeroNegative(checkProcessingTime),
          data: {
            centerNumber:
              (checkProcessingTime < 1 ? '< 1' : this.common.nondecimalFormatter(checkProcessingTime)) +
              (checkProcessingTime < 1 ? ' Day' : ' Days'),
            gdata: []
          },
          fdata: {
            type: 'bar chart',
            graphValues: [ediClaimsLobSummary.ClaimsAvgTat, paperClaimsLobSummary.ClaimsAvgTat],
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
          title: 'Reduce Claim Processing Time by:',
          MetricID: this.MetricidService.MetricIDs.ReduceClaimProcessingTimeBy,
          status: 404,
          data: null,
          fdata: null
        });
      }
      resolve(oppurtunities);
    });
  }
  /* function to create Reduce Reconsideration Process OPPORTUNITIES Tile in Overview Page -  Ranjith kumar Ankam - 04-Jul-2019*/
  reduceReconsiderationProcessMiniTile(providerSystems, oppurtunities) {
    return new Promise(resolve => {
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
        const selfService = providerSystems.SelfServiceInquiries.ALL.SelfService;
        const checkAvgProcessingTime =
          +selfService.AveragePaperReconsideredProcessingTime.toFixed(0) -
          +selfService.AverageReconsideredProcessingTime.toFixed(0);
        oppurtunities.push({
          category: 'mini-tile',
          title: 'Reduce Reconsideration Processing by:',
          MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
          toggle:
            this.toggle.setToggles(
              'Reduce Reconsideration Processing by:',
              'Self Service',
              'Service Interaction',
              false
            ) && this.common.checkZeroNegative(checkAvgProcessingTime),
          data: {
            centerNumber:
              (checkAvgProcessingTime < 1 ? '< 1' : this.common.nondecimalFormatter(checkAvgProcessingTime)) +
              (checkAvgProcessingTime < 1 ? ' Day' : ' Days'),
            gdata: []
          },
          fdata: {
            type: 'bar chart',
            graphValues: [
              selfService.AverageReconsideredProcessingTime,
              selfService.AveragePaperReconsideredProcessingTime
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
          title: 'Reduce Reconsideration Processing by:',
          MetricID: this.MetricidService.MetricIDs.ReduceReconsiderationProcessingBy,
          status: null,
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
    return new Promise(resolve => {
      if (
        claims != null &&
        claims.hasOwnProperty('All') &&
        claims.All != null &&
        claims.All.hasOwnProperty('ClaimsLobSummary')
      ) {
        if (claims.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
          const paidData = [];
          if (claims.hasOwnProperty('Mr') && claims.Mr != null) {
            if (
              claims.Mr.hasOwnProperty('ClaimsLobSummary') &&
              claims.Mr.ClaimsLobSummary.length &&
              claims.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              paidData.push(claims.Mr.ClaimsLobSummary[0].AmountPaid);
            }
          }
          if (claims.hasOwnProperty('Cs') && claims.Cs != null) {
            if (
              claims.Cs.hasOwnProperty('ClaimsLobSummary') &&
              claims.Cs.ClaimsLobSummary.length &&
              claims.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              paidData.push(claims.Cs.ClaimsLobSummary[0].AmountPaid);
            }
          }
          if (claims.hasOwnProperty('Ei') && claims.Ei != null) {
            if (
              claims.Ei.hasOwnProperty('ClaimsLobSummary') &&
              claims.Ei.ClaimsLobSummary.length &&
              claims.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              paidData.push(claims.Ei.ClaimsLobSummary[0].AmountPaid);
            }
          }
          if (claims.hasOwnProperty('Un') && claims.Un != null) {
            if (
              claims.Un.hasOwnProperty('ClaimsLobSummary') &&
              claims.Un.ClaimsLobSummary.length &&
              claims.Un.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')
            ) {
              paidData.push(claims.Un.ClaimsLobSummary[0].AmountPaid);
            }
          }
          claimsPaid = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Paid*',
            MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
            toggle: this.toggle.setToggles('Claims Paid', 'AtGlance', 'Overview', false),
            data: {
              graphValues: paidData,
              centerNumber:
                this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
                this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) > 0
                  ? '< $1'
                  : '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid),
              centerNumberOriginal: claims.All.ClaimsLobSummary[0].AmountPaid,
              color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
              gdata: ['card-inner', 'claimsPaidCardD3Donut'],
              labels: [lobName.mAndRMedicare, lobName.cAndSMedicaid, lobName.eAndICommerCial, lobName.unCategorized],
              hover: true
            },
            timeperiod: this.common.dateFormat(claims.Startdate) + '&ndash;' + this.common.dateFormat(claims.Enddate)
          };
          // AUTHOR: MADHUKAR - claims paid shows no color if the value is 0
          if (!paidData) {
            claimsPaid = {
              category: 'small-card',
              type: 'donut',
              title: 'Claims Paid*',
              MetricID: this.MetricidService.MetricIDs.ClaimsPaid,
              toggle: this.toggle.setToggles('Claims Paid', 'AtGlance', 'Overview', false),
              data: {
                graphValues: [0, 100],
                centerNumber:
                  this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) < 1 &&
                  this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid) > 0
                    ? '< $1'
                    : '$' + this.common.nFormatter(claims.All.ClaimsLobSummary[0].AmountPaid),
                centerNumberOriginal: claims.All.ClaimsLobSummary[0].AmountPaid,
                color: ['#D7DCE1', '#D7DCE1'],
                gdata: ['card-inner', 'claimsPaidCardD3Donut']
              },
              timeperiod: this.common.dateFormat(claims.Startdate) + '&ndash;' + this.common.dateFormat(claims.Enddate)
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
    return new Promise(resolve => {
      if (
        claims != null &&
        claims.hasOwnProperty('All') &&
        claims.All != null &&
        claims.All.hasOwnProperty('ClaimsLobSummary') &&
        claims.All.ClaimsLobSummary[0].ClaimsYieldRate.toFixed() !== 0
      ) {
        if (claims.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            title: 'Claims Yield*',
            MetricID: this.MetricidService.MetricIDs.ClaimsYield,
            toggle: this.toggle.setToggles('Claims Yield', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [
                claims.All.ClaimsLobSummary[0].ClaimsYieldRate,
                100 - claims.All.ClaimsLobSummary[0].ClaimsYieldRate
              ],
              centerNumber: claims.All.ClaimsLobSummary[0].ClaimsYieldRate.toFixed() + '%',
              centerNumberOriginal: claims.All.ClaimsLobSummary[0].ClaimsYieldRate,
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'claimsYieldCardD3Donut']
            },
            timeperiod: this.common.dateFormat(claims.Startdate) + '&ndash;' + this.common.dateFormat(claims.Enddate)
          };
        } else {
          claimsYield = {
            category: 'small-card',
            type: 'donut',
            toggle: this.toggle.setToggles('Claims Yield', 'AtGlance', 'Overview', false),
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
          toggle: this.toggle.setToggles('Claims Yield', 'AtGlance', 'Overview', false),
          data: null,
          sdata: null,
          timeperiod: null
        };
      }
      resolve(claimsYield);
    });
  }
  /* Function to create claims TAT tile starts here */
  createClaimsTAT(claims) {
    let claimsTAT: Object;
    return new Promise(resolve => {
      if (
        claims != null &&
        claims.hasOwnProperty('All') &&
        claims.All != null &&
        claims.All.hasOwnProperty('ClaimsLobSummary')
      ) {
        if (claims.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsAvgTat')) {
          claimsTAT = {
            category: 'small-card',
            type: 'tatRotateArrow',
            title: 'Avg. Claim Processing Days',
            MetricID: this.MetricidService.MetricIDs.ClaimsAverageTurnaroundTimetoPayment,
            data: {
              centerNumber: claims.All.ClaimsLobSummary[0].ClaimsAvgTat + ' days'
            },
            timeperiod: this.common.dateFormat(claims.Startdate) + '&ndash;' + this.common.dateFormat(claims.Enddate)
          };
        } else {
          claimsTAT = {
            category: 'small-card',
            type: 'tatRotateArrow',
            title: 'Avg. Claim Processing Days',
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
      } else {
        claimsTAT = {
          category: 'small-card',
          type: 'tatRotateArrow',
          title: null,
          data: null,
          sdata: null,
          timeperiod: null
        };
      }
      resolve(claimsTAT);
    });
  }
  /* function to calculate Claims Paid & Claims YIeld Rate TRENDS -  Ranjith kumar Ankam - 21-Oct-2019*/
  getClaimsTrends(claimsPaidObj, claimsYieldObj) {
    return new Promise(resolve => {
      const tempArray: Array<object> = [];
      const parameters = {
        providerkey: this.providerKey,
        TimeFilter: this.previousTimePeriod
      };

      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claims => {
        if (
          claims != null &&
          claims.hasOwnProperty('All') &&
          claims.All != null &&
          claims.All.hasOwnProperty('ClaimsLobSummary')
        ) {
        }
        tempArray[0] = claimsPaidObj;
        tempArray[1] = claimsYieldObj;
        resolve(tempArray);
      });
    });
  }
  /* function to get current Claims Paid & Claims YIeld Rate TRENDS -  Ranjith kumar Ankam - 04-Jul-2019*/
  getCurrentClaimsTrend(parameters) {
    let latestClaimsPaid;
    let latestClaimsYieldRate;
    return new Promise(resolve => {
      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claimsTrendLatestData => {
        if (
          claimsTrendLatestData != null &&
          claimsTrendLatestData.hasOwnProperty('All') &&
          claimsTrendLatestData.All != null &&
          claimsTrendLatestData.All.hasOwnProperty('ClaimsLobSummary')
        ) {
          if (claimsTrendLatestData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
            latestClaimsPaid = claimsTrendLatestData.All.ClaimsLobSummary[0].AmountPaid;
          }
          if (claimsTrendLatestData.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
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
    return new Promise(resolve => {
      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claimsTrendPreviousData => {
        if (
          claimsTrendPreviousData != null &&
          claimsTrendPreviousData.hasOwnProperty('All') &&
          claimsTrendPreviousData.All != null &&
          claimsTrendPreviousData.All.hasOwnProperty('ClaimsLobSummary')
        ) {
          if (claimsTrendPreviousData.All.ClaimsLobSummary[0].hasOwnProperty('AmountPaid')) {
            previousClaimsPaid = claimsTrendPreviousData.All.ClaimsLobSummary[0].AmountPaid;
          }
          if (claimsTrendPreviousData.All.ClaimsLobSummary[0].hasOwnProperty('ClaimsYieldRate')) {
            previousClaimsYieldRate = claimsTrendPreviousData.All.ClaimsLobSummary[0].ClaimsYieldRate;
          }
        }
        resolve({ previousClaimsPaid: previousClaimsPaid, previousClaimsYieldRate: previousClaimsYieldRate });
      });
    });
  }
  /*Function to get claims cards seperately - RANJITH KUMAR ANKAM - 16-July-2019 */
  getClaimsCards() {
    this.timeFrame = this.session.timeFrame;
    this.providerKey = this.session.providerKeyData();
    this.overviewPageData = [];
    return new Promise(resolve => {
      const tempArray: Array<object> = [];
      const parameters = {
        providerkey: this.providerKey,
        TimeFilter: this.baseTimePeriod
      };
      this.overviewService.getOverviewClaimsTrend(parameters).subscribe(claims => {
        this.createClaimsPaidObject(claims)
          .then(claimsPaid => {
            tempArray[0] = claimsPaid;
            return this.createClaimsYieldObject(claims);
          })
          .then(claimsYield => {
            tempArray[1] = claimsYield;
            return this.getClaimsTrends(tempArray[0], tempArray[1]);
          })
          .then(() => {
            return this.createClaimsTAT(claims);
          })
          .then(claimsTAT => {
            tempArray[2] = claimsTAT;
            resolve(tempArray);
          });
      }); // end subscribing to REST call
    }); // ends Promise
  }
  /* function to get PRIOR AUTH CARD seperately i overview page - RANJITH KUMAR ANKAM - 17th JULY 2019 */
  getPriorAuthCardData() {
    return new Promise(resolve => {
      const parameters = {
        providerKey: this.providerKey,
        allProviderTins: true
      };
      this.overviewService.getOverviewPriorAuth(parameters).subscribe(priorAuth => {
        let cPriorAuth: any;
        if (
          priorAuth &&
          priorAuth.hasOwnProperty('PriorAuthorizations') &&
          priorAuth.PriorAuthorizations !== null &&
          priorAuth.PriorAuthorizations.hasOwnProperty('LineOfBusiness') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.hasOwnProperty('All') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.All.hasOwnProperty('PriorAuthApprovedCount') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.All.hasOwnProperty('PriorAuthNotApprovedCount') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.All.hasOwnProperty('PriorAuthPendingCount') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.All.hasOwnProperty('PriorAuthCancelledCount') &&
          priorAuth.PriorAuthorizations.LineOfBusiness.All.PriorAuthApprovedCount +
            priorAuth.PriorAuthorizations.LineOfBusiness.All.PriorAuthNotApprovedCount >
            0
        ) {
          const priorAuthRequested =
            priorAuth.PriorAuthorizations.LineOfBusiness.All.PriorAuthApprovedCount +
            priorAuth.PriorAuthorizations.LineOfBusiness.All.PriorAuthNotApprovedCount;
          const approvedRate =
            priorAuth.PriorAuthorizations.LineOfBusiness.All.PriorAuthApprovedCount / priorAuthRequested;

          cPriorAuth = {
            category: 'small-card',
            type: 'donut',
            title: 'Prior Authorization Approval',
            MetricID: this.MetricidService.MetricIDs.PriorAuthorizationApproval,
            toggle: this.toggle.setToggles('Prior Authorization Approval', 'AtGlance', 'Overview', false),
            data: {
              graphValues: [approvedRate, 1 - approvedRate],
              centerNumber: (approvedRate * 100).toFixed(0) + '%',
              color: ['#3381FF', '#D7DCE1'],
              gdata: ['card-inner', 'priorAuthCardD3Donut']
            },
            sdata: null,
            timeperiod:
              this.common.dateFormatPriorAuth(priorAuth.PriorAuthorizations.ReportingStartDate) +
              '&ndash;' +
              this.common.dateFormatPriorAuth(priorAuth.PriorAuthorizations.ReportingEndDate)
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
    });
  }
  /* function to get TOTAL CALLS CARD seperately i overview page - RANJITH KUMAR ANKAM - 17th JULY 2019 */
  getTotalCallsCardData(trends) {
    return new Promise(resolve => {
      const parameters = {
        providerkey: this.providerKey,
        timeFilter: 'Last6Months'
      };
      let cIR: any;
      this.overviewService.getOverviewTotalCalls(parameters).subscribe(
        (response: ICallsResponse) => {
          const calls = response.Data;
          if (
            calls &&
            calls.hasOwnProperty('CallVolByQuesType') &&
            calls.CallVolByQuesType.hasOwnProperty('Total') &&
            calls.CallVolByQuesType.hasOwnProperty('Claims') &&
            calls.CallVolByQuesType.hasOwnProperty('BenefitsEligibility') &&
            calls.CallVolByQuesType.hasOwnProperty('PriorAuth') &&
            calls.CallVolByQuesType.hasOwnProperty('Others')
          ) {
            const startDate = calls.ReportStartDate;
            const endDate = calls.ReportEndDate;
            const timePeriodCalls: String =
              this.common.dateFormat(startDate) + '&ndash;' + this.common.dateFormat(endDate);
            cIR = {
              category: 'small-card',
              type: 'donut',
              title: 'Calls By Call Type',
              MetricID: this.MetricidService.MetricIDs.CallsbyCallType,
              toggle: this.toggle.setToggles('Total Calls', 'AtGlance', 'Overview', false),
              data: {
                graphValues: [
                  calls.CallVolByQuesType.Claims,
                  calls.CallVolByQuesType.BenefitsEligibility,
                  calls.CallVolByQuesType.PriorAuth,
                  calls.CallVolByQuesType.Others
                ],
                centerNumber: this.common.nondecimalFormatter(calls.CallVolByQuesType.Total),
                color: ['#3381FF', '#80B0FF', '#003DA1', '#00B8CC'],
                gdata: ['card-inner', 'callsCardD3Donut'],
                hover: true,
                labels: ['Claims', 'Eligibilty and Benefits', 'Prior Authorizations', 'Others']
              },
              sdata: {
                sign: '',
                data: ''
              },
              timeperiod: timePeriodCalls
            };
            if (
              trends != undefined &&
              trends != null &&
              trends.hasOwnProperty('TendingMtrics') &&
              trends.TendingMtrics != null &&
              trends.TendingMtrics.hasOwnProperty('CallsTrendByQuesType') &&
              trends.TendingMtrics.CallsTrendByQuesType != null
            ) {
              const dataPoint = trends.TendingMtrics.CallsTrendByQuesType.toFixed(1) + '%';
              if (trends.TendingMtrics.CallsTrendByQuesType >= 1) {
                cIR.sdata = {
                  sign: 'up-red',
                  data: dataPoint
                };
              } else if (
                trends.TendingMtrics.CallsTrendByQuesType < 1 &&
                trends.TendingMtrics.CallsTrendByQuesType >= 0
              ) {
                cIR.sdata = {
                  sign: 'neutral',
                  data: 'No Change'
                };
              } else {
                cIR.sdata = {
                  sign: 'down-green',
                  data: dataPoint
                };
              }
            } else {
              cIR.sdata = null;
            }
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
        },
        err => {
          console.log(err);
          cIR = {
            category: 'small-card',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
          resolve(cIR);
        }
      );
    });
  }

  getAllTrends() {
    this.providerKey = this.session.providerKeyData();
    return new Promise(resolve => {
      this.trendsService.getTrendingMetrics([this.providerKey]).subscribe(trends => {
        resolve(trends);
      });
    });
  }
} // end export class
