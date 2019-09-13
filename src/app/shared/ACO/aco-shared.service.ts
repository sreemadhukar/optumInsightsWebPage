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
  private lob = 'EI';
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
    let acoPage: Array<object>;
    let acoPageKeyPerformance: Array<object>;
    let acoPageMainCard: Array<object>;
    return new Promise(resolve => {
      this.acoservice.getAcoData().subscribe(data => {
        if (data.hasOwnProperty('LineOfBusiness')) {
          if (environment.internalAccess) {
            acoSummary = {
              category: 'app-small-card',
              type: 'textWithLabel',
              title: 'ACO Summary',
              data: {
                centerNumber: this.common.nFormatter(data.LineOfBusiness[this.lob].ACOSummary),
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
                  data.LineOfBusiness[this.lob].ratioPCPtoSpecOV.Target,
                  data.LineOfBusiness[this.lob].ratioPCPtoSpecOV.Actual
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
                  data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100,
                  100 - data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100
                ],
                centerNumber: (data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100).toFixed(2) + '%',
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
                actual: data.LineOfBusiness[this.lob].RxScriptsPer1000.Actual.toFixed(2),
                target: data.LineOfBusiness[this.lob].RxScriptsPer1000.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
            acuteAdmits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Admits',
              data: {
                actual: data.LineOfBusiness[this.lob].acuteAdmitsPer1000.Actual.toFixed(2),
                target: data.LineOfBusiness[this.lob].acuteAdmitsPer1000.Target.toFixed(2)
              },
              timeperiod: 'Contract Year to Date'
            };
          } else {
            acoSummary = {
              category: 'app-small-card',
              type: 'textWithLabel',
              title: 'ACO Summary',
              data: {
                centerNumber: this.common.nFormatter(data.LineOfBusiness[this.lob].ACOSummary),
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
                  data.LineOfBusiness[this.lob].ratioPCPtoSpecOV.Target,
                  data.LineOfBusiness[this.lob].ratioPCPtoSpecOV.Actual
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
                  data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100,
                  100 - data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100
                ],
                centerNumber: (data.LineOfBusiness[this.lob].RxGenericCompliance.Actual * 100).toFixed(2) + '%',
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
                actual: data.LineOfBusiness[this.lob].RxScriptsPer1000.Actual.toFixed(2),
                target: data.LineOfBusiness[this.lob].RxScriptsPer1000.Target.toFixed(2)
              }
            };
            acuteAdmits = {
              category: 'app-card',
              type: 'barActualTargetNumbers',
              title: 'Acute Admits',
              data: {
                actual: data.LineOfBusiness[this.lob].acuteAdmitsPer1000.Actual.toFixed(2),
                target: data.LineOfBusiness[this.lob].acuteAdmitsPer1000.Target.toFixed(2)
              }
            };
          }
        }
        acoPageKeyPerformance = [acuteAdmits, rxScripts];
        acoPageMainCard = [acoSummary, ratioPCP, rxGeneric];
        acoPage = [acoPageMainCard, acoPageKeyPerformance];
        resolve(acoPage);
      });
    });
  }
}
