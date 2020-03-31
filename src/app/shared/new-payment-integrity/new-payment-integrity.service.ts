import { Injectable } from '@angular/core';
import { PaymentIntegrityTabInfoService } from '../../rest/new-payment-integrity/payment-integrity-tab-info.service';

@Injectable({
  providedIn: 'root'
})
export class NewPaymentIntegrityService {
  public tabs: any;
  constructor(public paymentIntegrityTabInfoService: PaymentIntegrityTabInfoService) {}

  public tabInfo() {
    return new Promise(resolve => {
      this.paymentIntegrityTabInfoService.tabInfo().subscribe(
        (response: any) => {
          for (let i = 0; i < response.length; i++) {
            const startDate = this.dateFormating(response[i].PeriodStart);
            const endDate = this.dateFormating(response[i].PeriodEnd);
            response[i].date = startDate + '&ndash;' + endDate;
            response[i].apiStartDate = response[i].PeriodStart.substring(0, response[i].PeriodStart.length - 3);
            response[i].apiEndDate = response[i].PeriodEnd.substring(0, response[i].PeriodEnd.length - 3);
          }
          resolve(response);
        },
        err => {
          console.log('Check All RLP HCO Data Error', err);
        }
      );
    });
  }
  dateFormating(value: any) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const split = value.split('-');
    return monthNames[parseInt(split[1]) - 1] + ' ' + split[2] + ', ' + split[0];
  }
  public paymentIntergrity() {
    return new Promise(resolve => {
      this.paymentIntegrityTabInfoService.tabInfo().subscribe(
        response => {
          resolve(response);
        },
        err => {
          console.log('Check All RLP HCO Data Error', err);
        }
      );
    });
  }
}
