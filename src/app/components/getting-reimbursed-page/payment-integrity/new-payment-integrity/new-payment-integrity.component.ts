import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { GlossaryMetricidService } from '../../../../shared/glossary-metricid.service';
import { NewPaymentIntegrityService } from '../../../../shared/new-payment-integrity/new-payment-integrity.service';

@Component({
  selector: 'app-new-payment-integrity',
  templateUrl: './new-payment-integrity.component.html',
  styleUrls: ['./new-payment-integrity.component.scss']
})
export class NewPaymentIntegrityComponent implements OnInit {
  @Input() printStyle;
  tabOptions: Array<any> = [];
  tabOptionsSubTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  summaryItems: Array<any> = [];
  previousSelectedTab: any = 1;
  pageSubTitle: string;
  printDateTitle: String = '';
  printDateSubTitle: String = '';
  development = true;
  loading: boolean;
  constructor(
    public newPaymentIntegrityService: NewPaymentIntegrityService,
    private glossaryExpandService: GlossaryExpandService,
    public MetricidService: GlossaryMetricidService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.currentSummary = null;
    this.tabInfo();
  }
  tabInfo() {
    this.newPaymentIntegrityService.tabInfo().then((response: any) => {
      if (response.error) {
        this.currentSummary = [
          {
            category: 'app-card',
            title: 'Medical Records Requested by UHC',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
            status: response.status
          },
          {
            category: 'app-card',
            title: 'Coding Review Results',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
            status: response.status
          },
          {
            category: 'large-card',
            title: 'Medical Records Received vs. Awaiting Submission',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
            status: response.status
          }
        ];
        this.loading = false;
      } else if (response.length > 0) {
        const temp = [];
        this.tabOptions = [];
        for (let i = 0; i < response.length; i++) {
          temp[response[i].TabOrder - 1] = {
            id: response[i].TabOrder - 1,
            title: response[i].date,
            value1: response[i].LastRefresh,
            sdata: null,
            dataFlag: false,
            api: {
              StartDate: response[i].apiStartDate,
              EndDate: response[i].apiEndDate
            }
          };
          if (response[i].LastRefresh !== '' && response[i].LastRefresh) {
            temp[response[i].TabOrder - 1].value1 = 'Claims Processed through ' + response[i].LastRefresh;
          }
          if (response[i].Active === 'Y') {
            this.tabOptions = temp;
            this.previousSelectedTab = response[i].TabOrder - 1;
            this.newPaymentIntergrity(temp[response[i].TabOrder - 1].api, response[i].TabOrder - 1);
          }
        }
        this.tabOptions = temp;
      } else if (!response) {
        this.currentSummary = [
          {
            category: 'app-card',
            title: 'Medical Records Requested by UHC',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
            status: 500
          },
          {
            category: 'app-card',
            title: 'Coding Review Results',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
            status: 500
          },
          {
            category: 'large-card',
            title: 'Medical Records Received vs. Awaiting Submission',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
            status: 500
          }
        ];
      } else {
        this.currentSummary = [
          {
            category: 'app-card',
            title: 'Medical Records Requested by UHC',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequestedbyUHC,
            status: 500
          },
          {
            category: 'app-card',
            title: 'Coding Review Results',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
            status: 500
          },
          {
            category: 'large-card',
            title: 'Medical Records Received vs. Awaiting Submission',
            MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsReceivedvsAwaiting,
            status: 500
          }
        ];
        this.loading = false;
      }
    });
  }

  matOptionClicked(i: number) {
    this.loading = true;
    this.currentSummary = null;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    this.previousSelectedTab = i;
    this.newPaymentIntergrity(this.tabOptions[i].api, i);
  }
  helpIconClick(title, MetricID) {
    this.glossaryExpandService.setMessage(title, MetricID);
  }
  newPaymentIntergrity(api: any, index: any) {
    if (!this.tabOptions[index].dataFlag) {
      this.newPaymentIntegrityService.paymentIntergrity(api).then((response: any) => {
        this.loading = false;
        this.summaryItems[index] = response;
        this.currentSummary = this.summaryItems[index];
        this.tabOptions[index].dataFlag = true;
        this.printDateTitle = this.tabOptions[index].title;
        this.printDateSubTitle = this.tabOptions[index].value1;
      });
    } else {
      setTimeout(
        function() {
          this.loading = false;
          this.currentSummary = this.summaryItems[index];
        }.bind(this),
        600
      );
      this.printDateTitle = this.tabOptions[index].title;
      this.printDateSubTitle = this.tabOptions[index].value1;
    }
  }
}
