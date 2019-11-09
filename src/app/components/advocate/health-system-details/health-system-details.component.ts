import { Component, OnInit } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';

@Component({
  selector: 'app-health-system-details',
  templateUrl: './health-system-details.component.html',
  styleUrls: ['./health-system-details.component.scss']
})
export class HealthSystemDetailsComponent implements OnInit {
  dataLoading: boolean;
  healthSystemData: any;

  constructor(private healthSystemService: HealthSystemDetailsSharedService) {}

  ngOnInit() {
    this.getHealthSystemDetails();
  }

  getHealthSystemDetails() {
    this.dataLoading = true;
    this.healthSystemService
      .getHealthSystemData()
      .then(healthSystemData => {
        this.healthSystemData = JSON.parse(JSON.stringify(healthSystemData));
        this.dataLoading = false;
      })
      .catch(reason => {
        this.dataLoading = false;
        console.log('Health System Details are not available', reason);
      });
  }
}
