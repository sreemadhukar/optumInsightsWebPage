import { Injectable } from '@angular/core';
import { AcoModule } from '../../components/ACO/aco.module';
import { AcoService } from '../../rest/aco/aco.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment.stage';

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
    let rxGeneric: object;
    let ratioPCP: object;
    let acoPage: Array<object>;
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
              timeperiod: 'Rolling 30 Days'
            };
            ratioPCP = {
              category: 'app-small-card',
              type: 'bar',
              title: 'Ratio of PCP to Specialist Office Visits'
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
              timeperiod: 'Rolling 30 Days'
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
              title: 'Ratio of PCP to Specialist Office Visits'
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
          }

          acoPage = [acoSummary, ratioPCP, rxGeneric];
          resolve(acoPage);
        }
      });
    });
  }
}
