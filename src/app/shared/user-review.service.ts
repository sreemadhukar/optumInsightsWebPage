import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
declare const externalRatingIntercept: any;
@Injectable({
  providedIn: 'root'
})
export class UserReviewService {
  constructor(private cookieService: CookieService) {}

  removeCreatedCookies() {
    this.cookieService.delete('UZ_TI_dc_value');
    this.cookieService.delete('UZ_TI_S_0E30EBC3BF5CEA11AA60BF52C2E54AD8');
    this.cookieService.delete('s_sq');
    externalRatingIntercept();
  }
}
