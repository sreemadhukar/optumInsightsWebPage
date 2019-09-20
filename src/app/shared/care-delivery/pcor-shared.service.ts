import { Injectable } from '@angular/core';
import { PatientCareOpportunityService } from '../../rest/PCOR/patient-care-opportunity.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: CareDeliveryPageModule
})
export class PcorSharedService {
  private providerKey: number;
  constructor(private pcorService: PatientCareOpportunityService, private session: SessionService) {}
  public getQualityMeasureData() {
    return new Promise(resolve => {
      this.providerKey = this.session.providerKeyData();

      this.pcorService.getPCORQualityMeasureData([this.providerKey]).subscribe(
        data => {
          console.log('Quaility start', data);
          const preparedData = [];
          const capitalize = s => {
            if (typeof s !== 'string') {
              return '';
            }
            return s.charAt(0).toUpperCase() + s.slice(1);
          };
          const completeData = JSON.parse(JSON.stringify(data.fiveStarMeasureCount.Data));
          const countData = JSON.parse(JSON.stringify(data.fiveStarMeasureCount.Count));
          const template = ['zero', 'one', 'two', 'three', 'four', 'five'];
          for (let i = 5; i > 0; i--) {
            const metricName = template[i] + 'StarMeasureCount';
            if (data.hasOwnProperty(metricName)) {
              const m = {
                star: i,
                label: capitalize(template[i]) + ' Star Quality Measure',
                count: countData,
                data: completeData.filter(item => item.QualityRating === i)
              };
              preparedData.push(m);
            }
          }
          console.log('pre', preparedData);
          resolve(preparedData);
        },
        err => {
          console.log('PCOR Quality Star Error', err);
        }
      ); // end observable
    }); // end promise
  }
}
