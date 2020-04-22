import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
declare const externalRatingIntercept: any;
@Injectable({
  providedIn: 'root'
})
export class UserReviewService {
  abc: any;
  constructor(private cookieService: CookieService) {}

  removeCreatedCookies() {
    this.abc = document.getElementById('checking');
    console.log(this.abc);
    if (this.abc) {
      this.abc.replaceWith('');
    }
    this.cookieService.delete('UZ_TI_dc_value');
    this.cookieService.delete('UZ_TI_S_0E30EBC3BF5CEA11AA60BF52C2E54AD8');
    this.cookieService.delete('s_sq');
    this.cookieService.set('UZ_TI_dc_value', '0');
    externalRatingIntercept();
  }
}
