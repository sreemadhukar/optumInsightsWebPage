import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private performanceRestService: PerformanceRestService) {}
  public getPerformanceData() {
    this.performanceRestService.getPerformanceData().subscribe((response: any) => {
      console.log(response);
      return response;
    });
  }
}
