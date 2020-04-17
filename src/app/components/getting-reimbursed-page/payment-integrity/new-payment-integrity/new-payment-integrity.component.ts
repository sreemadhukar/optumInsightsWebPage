import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
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
    public MetricidService: GlossaryMetricidService,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.currentSummary = null;
    this.tabInfo();
  }
  tabInfo() {
    this.newPaymentIntegrityService.tabInfo().then((response: any) => {
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
    });
  }

  matOptionClicked(i: number, event: any) {
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
