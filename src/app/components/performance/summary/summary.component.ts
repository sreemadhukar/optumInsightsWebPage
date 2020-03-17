import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { rlpPageName, rlpPageConf, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from 'src/app/shared/common-utils.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  public titleForSummary;
  public subTitleForSummary;
  public summaryItems: any;
  public referralsLoading;
  public labsLoading;
  public prescriptionLoading;
  public referralMockCards;
  public labsMockCards;
  public prescriptionMockCards;
  public referralCard;
  public prescriptionCard;
  public labsCard;
  public subscription: any;
  timeFilterValueResolved: string;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private summarySharedService: SummarySharedService,
    private checkStorage: StorageService,
    private filtermatch: CommonUtilsService
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.summaryItems = response[0];
      console.log('SUmmary cards', this.summaryItems);
    });
  }

  ngOnInit() {
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
    this.titleForSummary = rlpPageConf.Summary.title;
    this.subTitleForSummary = rlpPageConf.Summary.subTitle;
    this.referralsData();
    this.labsData();
    this.prescriptionData();
  }

  referralsData() {
    this.referralsLoading = true;
    this.referralMockCards = [{}];
    this.referralCard = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.appCard)
      .then(data => {
        this.referralCard = JSON.parse(JSON.stringify(data));
        console.log('Component', rlpPageName.Referral, rlpCardType.appCard, data);
        // this.referralCard['timeperiod'] = `${this.timeFilterValueResolved} (${this.referralCard['timeperiod']})`;
        // this.referralCard['timeperiod'] = 'YTD';
        this.referralsLoading = false;
      })
      .catch(reason => {
        this.referralsLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }

  labsData() {
    this.labsLoading = true;
    this.labsMockCards = [{}];
    this.labsCard = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Labs, rlpCardType.appCard)
      .then(data => {
        this.labsCard = JSON.parse(JSON.stringify(data));
        console.log('Component', rlpPageName.Labs, rlpCardType.appCard, this.labsCard);
        // this.referralCard['timeperiod'] = `${this.timeFilterValueResolved} (${this.referralCard['timeperiod']})`;
        // this.referralCard['timeperiod'] = 'YTD';
        this.labsLoading = false;
      })
      .catch(reason => {
        this.labsLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }

  prescriptionData() {
    this.prescriptionLoading = true;
    this.prescriptionMockCards = [{}];
    this.prescriptionCard = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Perscription, rlpCardType.appCard)
      .then(data => {
        this.prescriptionCard = JSON.parse(JSON.stringify(data));
        console.log('Component', rlpPageName.Perscription, rlpCardType.appCard, data);
        // this.referralCard['timeperiod'] = `${this.timeFilterValueResolved} (${this.referralCard['timeperiod']})`;
        // this.referralCard['timeperiod'] = 'YTD';
        this.prescriptionLoading = false;
      })
      .catch(reason => {
        this.prescriptionLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }
}
