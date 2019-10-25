import { Injectable } from '@angular/core';
import { AcoModule } from '../../components/ACO/aco.module';
import { AcoService } from '../../rest/aco/aco.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcoSharedService {
  private lob = 'EmployerAndIndividual';
  constructor(
    private MetricidService: GlossaryMetricidService,
    private acoservice: AcoService,
    private common: CommonUtilsService,
    private session: SessionService,
    private toggle: AuthorizationService
  ) {}

  public acoData() {
    let acoSummary: object;
    let rxScripts: object;
    let rxGeneric: object;
    let ratioPCP: object;
    let acuteAdmits: object;
    let emergencyVisits: object;
    let acuteBedDays: object;
    let nonParticipatingSpecialistReferrals: object;
    let acoPage: Array<object>;
    let acoPageKeyPerformance: Array<object>;
    let acoPageMainCard: Array<object>;
    return new Promise(resolve => {
      this.acoservice.getAcoData().subscribe(data => {
        console.log(data.LinesOfBusiness[this.lob]);
        if (data.hasOwnProperty('LinesOfBusiness')) {
          console.log('am here');
          if (environment.internalAccess) {
            acoSummary = {
              category: 'app-small-card',
              type: 'textWithLabel',
              title: 'ACO Summary',
              data: {
                centerNumber: this.common.nFormatter(data.LinesOfBusiness[this.lob].AcoSummary),
                labels: 'Attributed Members'
              },
              bottomData: {
                labels: '4 of 5 Measures Meet MPT*',
                color: '#21B01E'
              },
              timeperiod: 'Contract Year to Date'
            };
            ratioPCP = {
              category: 'app-small-card',
              type: 'bar',
              title: 'Ratio of PCP to Specialist Office Visits',
              fdata: {
                type: 'bar chart',
                page: 'ACO',
                graphValues: [
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target,
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                ],
                color: ['#003DA1', '#FFFFFF', '#00B8CC'],
                gdata: ['bar-chart', 'ratiopcp']
              },
              timeperiod: 'Contract Year to Date'
            };
            rxGeneric = {
              category: 'app-small-card',
              type: 'donutWithLabel',
              title: 'RX Generic Compliance',
              data: {
                graphValues: [
                  data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100,
                  100 - data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100
                ],
                centerNumber: (data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100).toFixed(2) + '%',
                color: ['#3381FF', '#D7DCE1'],
                gdata: ['card-inner', 'claimsNonPaymentRate'],
                sdata: {
                  label: 'MPT Not Defined'
                }
              },
              timeperiod: 'Contract Year to Date'
            };
            rxScripts = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Rx Script',
              data: {
                actual: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
            acuteAdmits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Admits',
              data: {
                actual: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
            nonParticipatingSpecialistReferrals = {
              category: 'app-card',
              type: 'barActualTargetPercentage',
              title: 'Non-Participating Specialist Referrals',
              data: {
                actual: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual.toFixed(4),
                target: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target.toFixed(4)
              },
              timeperiod: 'Contract Year to Date'
            };
            emergencyVisits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Emergency Visits',
              data: {
                actual: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
            acuteBedDays = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Bed Days',
              data: {
                actual: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
          } else {
            console.log('am here');
            acoSummary = {
              category: 'app-small-card',
              type: 'textWithLabel',
              title: 'ACO Summary',
              data: {
                centerNumber: this.common.nFormatter(data.LinesOfBusiness[this.lob].AcoSummary),
                labels: 'Attributed Members'
              },
              bottomData: {
                labels: '4 of 5 Measures Meet Target',
                color: '#21B01E'
              }
            };
            ratioPCP = {
              category: 'app-small-card',
              type: 'bar',
              title: 'Ratio of PCP to Specialist Office Visits',
              fdata: {
                type: 'bar chart',
                graphValues: [
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target,
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                ],
                color: ['#003DA1', '#FFFFFF', '#00B8CC'],
                gdata: ['small-card-structure', 'ratiopcp']
              }
            };
            rxGeneric = {
              category: 'app-small-card',
              type: 'donutWithLabel',
              title: 'RX Generic Compliance',
              data: {
                graphValues: [
                  data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100,
                  100 - data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100
                ],
                centerNumber: (data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual * 100).toFixed(2) + '%',
                color: ['#3381FF', '#D7DCE1'],
                gdata: ['card-inner', 'claimsNonPaymentRate'],
                sdata: {
                  label: 'MPT Not Defined'
                }
              }
            };
            rxScripts = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Rx Script',
              data: {
                actual: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target.toFixed(2)
              }
            };
            acuteAdmits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Admits',
              data: {
                actual: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target.toFixed(2)
              }
            };
            nonParticipatingSpecialistReferrals = {
              category: 'app-card',
              type: 'barActualTargetPercentage',
              title: 'Non-Participating Specialist Referrals',
              data: {
                actual: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual.toFixed(4),
                target: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target.toFixed(4)
              }
            };
            emergencyVisits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Emergency Visits',
              data: {
                actual: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target.toFixed(2)
              }
            };
            acuteBedDays = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Bed Days',
              data: {
                actual: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual.toFixed(2),
                target: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target.toFixed(2)
              }
            };
          }
        }
        acoPageKeyPerformance = [
          acuteAdmits,
          acuteBedDays,
          emergencyVisits,
          nonParticipatingSpecialistReferrals,
          rxScripts
        ];
        acoPageMainCard = [acoSummary, ratioPCP, rxGeneric];
        acoPage = [acoPageMainCard, acoPageKeyPerformance];
        console.log(acoPageKeyPerformance, acoPage);
        resolve(acoPage);
      });
    });
  }
}
