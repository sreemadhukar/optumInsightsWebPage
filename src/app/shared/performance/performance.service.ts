import { Injectable } from '@angular/core';
import { PerformanceRestService } from '../../rest/performance/performance-rest.service';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(private performanceRestService: PerformanceRestService) {}
  public getPerformanceData() {
    const data = this.performanceRestService.getPerformanceData();

    return data;
  }
}
