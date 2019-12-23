import { HttpErrorResponse } from '@angular/common/http';
import { NonPaymentService } from './../../../rest/getting-reimbursed/non-payment.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TopClaimsSharedService {
  constructor(private nonPaymentService: NonPaymentService) {}

  public getClaimsData() {
    return new Promise((resolve, reject) => {
      this.nonPaymentService.getClaimsDetailData().subscribe(data => {
        const claimsData = data;
        resolve(claimsData);
      });
    });
  }
}
