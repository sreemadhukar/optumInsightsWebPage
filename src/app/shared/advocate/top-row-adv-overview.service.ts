import { Injectable } from '@angular/core';
import { TopRowAdvOverviewService } from './../../rest/advocate/top-row-adv-overview.service';

@Injectable({
  providedIn: 'root'
})
export class TopRowAdvOverviewSharedService {
  constructor(private topRowService: TopRowAdvOverviewService) {}
}
