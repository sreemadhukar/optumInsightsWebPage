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
          let preparedData: Array<Object> = [];
          if (data) {
            // Captilize the first alphabet of the string
            const capitalize = s => {
              if (typeof s !== 'string') {
                return '';
              }
              return s.charAt(0).toUpperCase() + s.slice(1);
            };
            const completeData = JSON.parse(JSON.stringify(data.fiveStarMeasureCount.Data));
            const template = ['zero', 'one', 'two', 'three', 'four', 'five'];
            for (let i = 5; i > 0; i--) {
              const metricName = template[i] + 'StarMeasureCount';
              if (data.hasOwnProperty(metricName)) {
                const m = {
                  star: i,
                  label: capitalize(template[i]) + ' Star Quality Measure',
                  count: completeData.filter(item => item.QualityRating === i).length,
                  insideData: completeData.filter(item => item.QualityRating === i)
                };
                preparedData.push(m);
              } // end if structure
            } // end for loop
          } else {
            preparedData = null;
          }
          console.log('PCOR Shared Prepared Data', preparedData);
          resolve(preparedData);
        },
        err => {
          console.log('PCOR Quality Star Error', err);
        }
      ); // end observable
    }); // end promise
  } // end getQualityMeasureData method
} // end PcorSharedService class
