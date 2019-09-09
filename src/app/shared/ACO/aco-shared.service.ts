import { Injectable } from '@angular/core';
import { AcoModule } from '../../components/ACO/aco.module';
import { AcoService } from '../../rest/aco/aco.service';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';
import { AuthorizationService } from '../../auth/_service/authorization.service';
import { GlossaryMetricidService } from '../glossary-metricid.service';
import { of } from 'rxjs';

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
    let acoPage: Array<object>;
    return new Promise(resolve => {
      this.acoservice.getAcoData().subscribe(data => {
        if (data.hasOwnProperty('LineOfBusiness')) {
          console.log();
          acoSummary = {
            category: 'app-card',
            type: 'textWithLabel',
            title: 'ACO Summary',
            data: {
              centerNumber: data.LineOfBusiness[this.lob].ACOSummary,
              labels: 'Attributed Members'
            },
            bottomData: {
              labels: '4 of 5 Measures Meet Target',
              color: '#21B01E'
            },
            timeperiod: 'Rolling 30 Days'
          };
        }
        acoPage = [acoSummary];
        resolve(acoPage);
      });
    });
  }
}
