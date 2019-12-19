import { Component, OnInit } from '@angular/core';
import { HealthSystemDetailsSharedService } from '../../../shared/advocate/health-system-details-shared.service';
import { StorageService } from '../../../shared/storage-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-health-system-details',
  templateUrl: './health-system-details.component.html',
  styleUrls: ['./health-system-details.component.scss']
})
export class HealthSystemDetailsComponent implements OnInit {
  dataLoading: boolean;
  healthSystemData: any;
  subscription: any;

  constructor(
    private healthSystemService: HealthSystemDetailsSharedService,
    private checkStorage: StorageService,
    private router: Router
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {
    this.healthSystemData = null;
    this.getHealthSystemDetails();
  }

  getHealthSystemDetails() {
    this.dataLoading = true;
    this.healthSystemService
      .getHealthSystemData()
      .then(healthSystemData => {
        this.dataLoading = false;
        this.healthSystemData = JSON.parse(JSON.stringify(healthSystemData));
      })
      .catch(reason => {
        this.dataLoading = false;
        console.log('Health System Details are not available', reason);
      });
  }

  viewInsights() {
    this.router.navigate(['/OverviewPageAdvocate']);
  }
}
