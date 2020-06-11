import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE } from '../../../store/filter/actions';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { rlpPageName, rlpPageConf, rlpCardType } from '../../../modals/rlp-data';
import { StorageService } from '../../../shared/storage-service.service';
import { CommonUtilsService } from '../../../shared/common-utils.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {
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
  public countHCOnull: number;
  timeFilterValueResolved: string;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private summarySharedService: SummarySharedService,
    private checkStorage: StorageService,
    private filtermatch: CommonUtilsService,
    private route: Router
  ) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.filtermatch.urlResuseStrategy());
  }

  ngOnInit() {
    this.countHCOnull = 0;
    this.ngRedux.dispatch({ type: CURRENT_PAGE, currentPage: 'performanceSummary' });
    this.titleForSummary = rlpPageConf.Summary.title;
    this.subTitleForSummary = rlpPageConf.Summary.subTitle;
    this.referralsData();
    this.labsData();
    this.prescriptionData();
  }
  ngOnDestroy() {
    this.summarySharedService.unGetHCOdata();
  }
  incrementHCOnull() {
    this.countHCOnull++;
    if (this.countHCOnull === 3) {
      this.route.navigate(['/OverviewPage']);
    }
  }
  referralsData() {
    this.referralsLoading = true;
    this.referralMockCards = [{}];
    this.referralCard = [];
    this.summarySharedService
      .getHCOdata(rlpPageName.Referral, rlpCardType.appCard)
      .then(data => {
        this.referralsLoading = false;
        if (data) {
          this.referralCard = data;
        } else {
          this.incrementHCOnull();
        }
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
        this.labsLoading = false;
        if (data) {
          this.labsCard = data;
        } else {
          this.incrementHCOnull();
        }
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
        this.prescriptionLoading = false;
        if (data) {
          this.prescriptionCard = data;
        } else {
          this.incrementHCOnull();
        }
      })
      .catch(reason => {
        this.prescriptionLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }
}
