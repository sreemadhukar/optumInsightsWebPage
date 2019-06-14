import { Component, OnInit } from '@angular/core';
import { PriorAuthService } from '../../../rest/prior-auth/prior-auth.service';
import { SessionService } from '../../../shared/session.service';
import { StorageService } from '../../../shared/storage-service.service';
import { PriorAuthSharedService } from '../../../shared/prior-authorization/prior-auth.service';

@Component({
  selector: 'app-patient-care-opportunity',
  templateUrl: './patient-care-opportunity.component.html',
  styleUrls: ['./patient-care-opportunity.component.scss']
})
export class PatientCareOpportunityComponent implements OnInit {
  subscription: any;
  summaryItems: any;
  pageTitle: String = '';
  loading: boolean;
  MRAStarData: any;
  MRACVCompletionData: any;
  StarRatings: any;
  mockCards: any;
  tabOptions: Array<Object> = [];
  previousSelected: Number = 0;
  selectedItemId: any = 0;
  tabOptionsTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  currentTabTitle: String = '';
  hideAllObjects: boolean;
  constructor(
    private priorAuthService: PriorAuthService,
    private sessionService: SessionService,
    private checkStorage: StorageService,
    private priorAuthShared: PriorAuthSharedService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
    this.tabOptionsTitle = ['All', 'Diabetic'];
  }
  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }
  matOptionClicked(i: number, event: any) {
    this.currentSummary = this.summaryItems[i].data;
    this.currentTabTitle = this.summaryItems[i].title;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    //    event.target.classList.add('active');
  }
  ngOnInit() {
    this.pageTitle = 'Patient Care Opportunity–Medicare & Retirement';
    this.loading = true;
    this.hideAllObjects = true;
    this.mockCards = [{}, {}];
    this.MRAStarData = [{ id: '1' }, { id: '2' }];
    this.summaryItems = [{}];
    // this.MRACVCompletionData=[{}];

    this.priorAuthShared.getPCORMandRData().then(
      data => {
        this.loading = false;
        this.summaryItems = JSON.parse(JSON.stringify(data));
        this.MRAStarData = this.summaryItems[0];
        this.MRACVCompletionData = this.summaryItems[1];
        this.currentTabTitle = this.summaryItems[1].title;
        this.StarRatings = this.summaryItems[2];

        // this.MRAStarData = data[0];
        // this.MRACVCompletionData=data[1];
        console.log(this.MRACVCompletionData);
        this.tabOptions = [];
        for (let i = 0; i < 2; i++) {
          const temp = {
            id: i,
            title: this.getTabOptionsTitle(i)
            // value1: this.MRAStarData[i].data[0].data.centerNumber,
            // sdata: {
            //   sign: this.MRAStarData[i].data[0].data.sdata.sign,
            //   value: this.MRAStarData[i].data[0].data.sdata.data
            // }
          };

          this.tabOptions.push(temp);
          alert(this.tabOptions.push(temp));
        }
      },
      error => {
        this.hideAllObjects = false;
      }
    );
  }
}
