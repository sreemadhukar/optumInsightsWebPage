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
            category: 'small-cards',
            type: 'donut',
            title: 'Prior Authorization Approval',
            data: {
              cValues: [(approvedRate * 100).toFixed(1)],
              cData: (approvedRate * 100).toFixed(1) + '%',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: []
            },
            sdata: {
              sign: 'up',
              data: '+1%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cPriorAuth = {
            category: 'small-cards',
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
            category: 'small-cards',
            type: 'donut',
            title: 'Self Service Adoption Rate',
            data: {
              cValues: [(data.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0)],
              cData: (data.SelfServiceInquiries.ALL.Utilizations.OverallLinkAdoptionRate * 100).toFixed(0) + '%',
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: []
            },
            sdata: {
              sign: 'down',
              data: '-1.3%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cSelfService = {
            category: 'small-cards',
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
            category: 'small-cards',
            type: 'star',
            title: 'Medicare Star Rating',
            data: {
              cValues: [data.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(2)],
              cData: data.PatientCareOpportunity.LineOfBusiness.MedicareAndRetirement.AverageStarRating.toFixed(2),
              color: ['#00A8F7', '#F5F5F5', '#FFFFFF'],
              gdata: []
            },
            sdata: null,
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cPcor = { category: 'small-cards', type: 'star', title: null, data: null, sdata: null, timeperiod: null };
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
            category: 'small-cards',
            type: 'donut',
            title: 'Total Calls',
            data: {
              cValues: [
                data.ResolvingIssues.Calls.CallVolByQuesType.Claims,
                data.ResolvingIssues.Calls.CallVolByQuesType.BenefitsEligibility,
                data.ResolvingIssues.Calls.CallVolByQuesType.PriorAuth,
                data.ResolvingIssues.Calls.CallVolByQuesType.Others
              ],
              cData: this.nFormatter(data.ResolvingIssues.Calls.CallVolByQuesType.Total),
              color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
              gdata: []
            },
            sdata: null,
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          cIR = { category: 'small-cards', type: 'donut', title: null, data: null, sdata: null, timeperiod: null };
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
            category: 'small-cards',
            type: 'donut',
            title: 'Claims Paid',
            data: {
              cValues: [
                data1.Mr.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                data1.Cs.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid'),
                data1.Ei.ClaimsLobSummary[0].hasOwnProperty('AmountUHCPaid')
              ],
              cData: this.nFormatter(data1.All.ClaimsLobSummary[0].AmountUHCPaid),
              color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
              gdata: []
            },
            sdata: {
              sign: 'down',
              data: '-2.8%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          claimsPaid = {
            category: 'small-cards',
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
            category: 'small-cards',
            type: 'donut',
            title: 'Claims Yield',
            data: {
              cValues: [claimYieldDonut.toFixed()],
              cData: claimYieldDonut.toFixed() + '%',
              color: [{ color1: '#00A8F7' }, { color2: '#F5F5F5' }, { color3: '#FFFFFF' }],
              gdata: []
            },
            sdata: {
              sign: 'up',
              data: '+2.3%'
            },
            timeperiod: 'Timeperiod - Rolling 12 Months'
          };
        } else {
          claimsYield = {
            category: 'small-cards',
            type: 'donut',
            title: null,
            data: null,
            sdata: null,
            timeperiod: null
          };
        }
        this.overviewPageData.push(claimsPaid, cPriorAuth, cSelfService, claimsYield, cPcor, cIR);
        if (this.overviewPageData.length) {
          resolve(this.overviewPageData);
        }
      });
    });
  }
}
