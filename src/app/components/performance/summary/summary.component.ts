import { Component, OnInit } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../store/store';
import { CURRENT_PAGE, REMOVE_FILTER } from '../../../store/filter/actions';
import { PerformanceService } from '../../../shared/performance/performance.service';
// import { RlpHeaderComponent } from '../../../rlp-common-utils/rlp-header';
import { rlpPageConf } from '../../../modals/rlp-data';
import { SummarySharedService } from '../../../shared/performance/summary-shared.service';
import { CreatePayloadService } from '../../../shared/uhci-filters/create-payload.service';

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
  public referralMockCards;
  public referralCard;
  public prescriptionCard;
  public labsCard;
  timeFilterValueResolved: string;
  constructor(
    private ngRedux: NgRedux<IAppState>,
    private perfShared: PerformanceService,
    private summarySharedService: SummarySharedService,
    private createPayloadService: CreatePayloadService
  ) {
    this.perfShared.getPerformanceData().subscribe((response: any) => {
      this.summaryItems = response[0];
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
      .referralsShared(this.createPayloadService.payload)
      .then(data => {
        console.log('referralData', data);
        this.referralCard = JSON.parse(JSON.stringify(data));
        console.log('this.referralCard---------->', this.referralCard);
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
    this.referralsLoading = true;
    this.referralMockCards = [{}];
    this.labsCard = [];
    this.summarySharedService
      .labsShared(this.createPayloadService.payload)
      .then(data => {
        console.log('labsData', data);
        this.labsCard = JSON.parse(JSON.stringify(data));
        console.log('this.labsCard---------->', this.labsCard);
        // this.referralCard['timeperiod'] = `${this.timeFilterValueResolved} (${this.referralCard['timeperiod']})`;
        // this.referralCard['timeperiod'] = 'YTD';
        this.referralsLoading = false;
      })
      .catch(reason => {
        this.referralsLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }

  prescriptionData() {
    this.referralsLoading = true;
    this.referralMockCards = [{}];
    this.prescriptionCard = [];
    this.summarySharedService
      .prescriptionShared(this.createPayloadService.payload)
      .then(data => {
        console.log('prescriptionData', data);
        this.prescriptionCard = JSON.parse(JSON.stringify(data));
        console.log('this.prescriptionCard---------->', this.prescriptionCard);
        // this.referralCard['timeperiod'] = `${this.timeFilterValueResolved} (${this.referralCard['timeperiod']})`;
        // this.referralCard['timeperiod'] = 'YTD';
        this.referralsLoading = false;
      })
      .catch(reason => {
        this.referralsLoading = false;
        console.log('Error Payment Submission Adovate Overview page Payment', reason);
      });
  }
}
