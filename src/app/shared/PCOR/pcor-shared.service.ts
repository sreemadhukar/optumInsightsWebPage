import { Injectable } from '@angular/core';
import { PatientCareOpportunityService } from '../../rest/PCOR/patient-care-opportunity.service';
import { CareDeliveryPageModule } from '../../components/care-delivery-page/care-delivery-page.module';
import { CommonUtilsService } from '../common-utils.service';
import { SessionService } from '../session.service';

@Injectable({
  providedIn: 'root'
})
export class PCORSharedService {
  private PCORData: Array<object> = [];
  private timeFrame: string;
  private providerKey: number;
  private PCORDataCombined: any;
  constructor(
    private patientCareOpportunityService: PatientCareOpportunityService,
    private session: SessionService,
    private common: CommonUtilsService
  ) {}
  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }

  public generateMonth(a) {
    if (a === 0) {
      return 'January';
    } else if (a === 1) {
      return 'February';
    } else if (a === 2) {
      return 'March';
    } else if (a === 3) {
      return 'April';
    } else if (a === 4) {
      return 'May';
    } else if (a === 5) {
      return 'June';
    } else if (a === 6) {
      return 'July';
    } else if (a === 7) {
      return 'August';
    } else if (a === 8) {
      return 'September';
    } else if (a === 9) {
      return 'October';
    } else if (a === 10) {
      return 'November';
    } else if (a === 11) {
      return 'December';
    } else {
      return null;
    }
  }

  public ReturnMonthlyCountString(a) {
    if (a === 0) {
      return '01';
    } else if (a === 1) {
      return '02';
    } else if (a === 2) {
      return '03';
    } else if (a === 3) {
      return '04';
    } else if (a === 4) {
      return '05';
    } else if (a === 5) {
      return '06';
    } else if (a === 6) {
      return '07';
    } else if (a === 7) {
      return '08';
    } else if (a === 8) {
      return '09';
    } else if (a === 9) {
      return '10';
    } else if (a === 10) {
      return '11';
    } else if (a === 11) {
      return '12';
    }
  }
  public getQualityMeasureData() {
    return new Promise(resolve => {
      this.providerKey = this.session.providerKeyData();

      this.patientCareOpportunityService.getPCORQualityMeasureData([this.providerKey]).subscribe(
        qualitydta => {
          const tempArray = [];

          const temp = JSON.parse(JSON.stringify(qualitydta.fiveStarMeasureCount.Data));

          if (qualitydta.hasOwnProperty('fiveStarMeasureCount')) {
            const x = {
              star: 5,
              label: 'Five Star Quality Measure',
              count: qualitydta.fiveStarMeasureCount.Count,
              data: []
            };
            x.data = temp.filter(item => item.QualityRating === x.star);
            tempArray.push(x);

            console.log(tempArray);
          }

          if (qualitydta.hasOwnProperty('fourStarMeasureCount')) {
            const x = {
              star: 4,
              label: 'Four Star Quality Measure',
              count: qualitydta.fourStarMeasureCount.Count,
              data: []
            };
            x.data = temp.filter(item => item.QualityRating === x.star);
            tempArray.push(x);
          }
          if (qualitydta.hasOwnProperty('threeStarMeasureCount')) {
            const x = {
              star: 3,
              label: 'Three Star Quality Measure',
              count: qualitydta.threeStarMeasureCount.Count,
              data: []
            };
            x.data = temp.filter(item => item.QualityRating === x.star);
            tempArray.push(x);
          }
          if (qualitydta.hasOwnProperty('twoStarMeasureCount')) {
            const x = {
              star: 2,
              label: 'Two Star Quality Measure',
              count: qualitydta.twoStarMeasureCount.Count,
              data: []
            };
            x.data = temp.filter(item => item.QualityRating === x.star);
            tempArray.push(x);
          }
          if (qualitydta.hasOwnProperty('oneStarMeasureCount')) {
            const x = {
              star: 1,
              label: 'One Star Quality Measure',
              count: qualitydta.oneStarMeasureCount.Count,
              data: []
            };
            x.data = temp.filter(item => item.QualityRating === x.star);
            tempArray.push(x);
          }

          resolve(tempArray);
        },
        err => {
          console.log('PCOR Error', err);
        }
      ); // end observable
    }); // end promise
  }
}
