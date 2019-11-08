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
    let contractSTRPeriod: Date;
    let contractENDPeriod: Date;
    let MPTData = 0;
    return new Promise(resolve => {
      this.acoservice.getAcoData().subscribe(data => {
        contractSTRPeriod = new Date(data.ContractEffDate);
        contractENDPeriod = new Date(data.ContractEndDate);
        if (data.hasOwnProperty('LinesOfBusiness')) {
          if (environment.internalAccess) {
            if (data.LinesOfBusiness[this.lob].AcoSummary !== 'N/A') {
              if (
                data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target !== 'N/A' &&
                data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target) >=
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target) >=
                  data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              acoSummary = {
                category: 'app-small-card',
                type: 'textWithLabel',
                title: 'ACO Summary',
                data: {
                  centerNumber: this.common.nFormatter(data.LinesOfBusiness[this.lob].AcoSummary),
                  labels: 'Attributed Members'
                },
                bottomData: {
                  labels: MPTData + ' of 5 Measures Meet MPT*',
                  color: '#21B01E'
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (
              data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target !== 'N/A' &&
              data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual !== 'N/A'
            ) {
              ratioPCP = {
                category: 'app-small-card',
                type: 'bar',
                title: 'Ratio of PCP to Specialist Office Visits',
                fdata: {
                  type: 'bar chart',
                  page: 'ACO',
                  graphValues: [
                    parseInt(data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target),
                    data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                  ],
                  color: ['#003DA1', '#FFFFFF', '#00B8CC'],
                  gdata: ['bar-chart', 'ratiopcp']
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual !== 'N/A') {
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
            }
            if (
              data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target !== 'N/A'
            ) {
              rxScripts = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Rx Script',
                data: {
                  actual: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target).toFixed(2)
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (
              data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target !== 'N/A'
            ) {
              acuteAdmits = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Acute Admits',
                data: {
                  actual: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target).toFixed(2)
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (
              data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target !== 'N/A'
            ) {
              nonParticipatingSpecialistReferrals = {
                category: 'app-card',
                type: 'barActualTargetPercentage',
                title: 'Non-Participating Specialist Referrals',
                data: {
                  actual: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual.toFixed(4),
                  target: parseInt(data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target).toFixed(4)
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (
              data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target !== 'N/A'
            ) {
              emergencyVisits = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Emergency Visits',
                data: {
                  actual: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target).toFixed(2)
                },
                timeperiod: 'Contract Year to Date'
              };
            }
            if (
              data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target !== 'N/A'
            ) {
              acuteBedDays = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Acute Bed Days',
                data: {
                  actual: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target).toFixed(2)
                },
                timeperiod: 'Contract Year to Date'
              };
            }
          } else {
            if (data.LinesOfBusiness[this.lob].AcoSummary !== 'N/A') {
              if (
                data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target !== 'N/A' &&
                data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target) >=
                  data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target) >=
                  data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              if (
                data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual !== 'N/A' &&
                data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target !== 'N/A'
              ) {
                if (
                  parseInt(data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target) >=
                  data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual
                ) {
                  MPTData++;
                }
              }
              acoSummary = {
                category: 'app-small-card',
                type: 'textWithLabel',
                title: 'ACO Summary',
                data: {
                  centerNumber: this.common.nFormatter(data.LinesOfBusiness[this.lob].AcoSummary),
                  labels: 'Attributed Members'
                },
                bottomData: {
                  labels: MPTData + ' of 5 Measures Meet Target',
                  color: '#21B01E'
                }
              };
            }
            if (
              data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target !== 'N/A' &&
              data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual !== 'N/A'
            ) {
              ratioPCP = {
                category: 'app-small-card',
                type: 'bar',
                title: 'Ratio of PCP to Specialist Office Visits',
                fdata: {
                  type: 'bar chart',
                  graphValues: [
                    parseInt(data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Target),
                    data.LinesOfBusiness[this.lob].RatioPCPtoSpecOV.Actual
                  ],
                  color: ['#003DA1', '#FFFFFF', '#00B8CC'],
                  gdata: ['small-card-structure', 'ratiopcp']
                }
              };
            }
            if (data.LinesOfBusiness[this.lob].RxGenericCompliance.Actual !== 'N/A') {
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
            }
            if (
              data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target !== 'N/A'
            ) {
              rxScripts = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Rx Script',
                data: {
                  actual: data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].RxScriptsPerThousand.Target).toFixed(2)
                }
              };
            }
            if (
              data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target !== 'N/A'
            ) {
              acuteAdmits = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Acute Admits',
                data: {
                  actual: data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].AcuteAdmitsPerThousand.Target).toFixed(2)
                }
              };
            }
            if (
              data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target !== 'N/A'
            ) {
              nonParticipatingSpecialistReferrals = {
                category: 'app-card',
                type: 'barActualTargetPercentage',
                title: 'Non-Participating Specialist Referrals',
                data: {
                  actual: data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Actual.toFixed(4),
                  target: parseInt(data.LinesOfBusiness[this.lob].NonParSpecialistReferrals.Target).toFixed(4)
                }
              };
            }
            if (
              data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target !== 'N/A'
            ) {
              emergencyVisits = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Emergency Visits',
                data: {
                  actual: data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].EmergencyVisitsPerThousand.Target).toFixed(2)
                }
              };
            }
            if (
              data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual !== 'N/A' &&
              data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target !== 'N/A'
            ) {
              acuteBedDays = {
                category: 'app-card',
                type: 'barActualTargetNumbers',
                title: 'Acute Bed Days',
                data: {
                  actual: data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Actual.toFixed(2),
                  target: parseInt(data.LinesOfBusiness[this.lob].AcuteBedDaysPerThousand.Target).toFixed(2)
                }
              };
            }
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
        acoPage = [
          acoPageMainCard,
          acoPageKeyPerformance,
          contractSTRPeriod,
          contractENDPeriod,
          data.ReportMeasureQuarter
        ];
        resolve(acoPage);
      });
    });
  }
}