import { Injectable } from '@angular/core';
import { KopInsightsRestService } from 'src/app/rest/know-our-provider/kop-insights-rest.service';

@Injectable({
  providedIn: 'root'
})
export class KopInsightsService {
  constructor(private kopRestService: KopInsightsRestService) {}

  public getKopInsightsData(callback: any) {
    this.kopRestService.getKopData().subscribe((response: any) => {
      return callback(response);
    });
  }
}
