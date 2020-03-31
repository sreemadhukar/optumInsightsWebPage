import { Component, OnInit, Input } from '@angular/core';
import { SessionService } from 'src/app/shared/session.service';
import { GlossaryMetricidService } from '../../../../shared/glossary-metricid.service';
import { NewPaymentIntegrityService } from '../../../../shared/new-payment-integrity/new-payment-integrity.service';

@Component({
  selector: 'app-new-payment-integrity',
  templateUrl: './new-payment-integrity.component.html',
  styleUrls: ['./new-payment-integrity.component.scss']
})
export class NewPaymentIntegrityComponent implements OnInit {
  @Input() printStyle;
  tabOptions: Array<Object> = [];
  tabOptionsTitle: Array<String> = [];
  tabOptionsSubTitle: Array<String> = [];
  currentSummary: Array<Object> = [{}];
  summaryItems: any;
  previousSelectedTab: any = 1;
  pageSubTitle: string;
  printDateTitle: String = '';
  printDateSubTitle: String = '';
  development = true;
  constructor(
    public newPaymentIntegrityService: NewPaymentIntegrityService,
    public MetricidService: GlossaryMetricidService,
    private session: SessionService
  ) {
    // this.tabOptionsTitle = ['Jul 1, 2018–Jun 30, 2019', 'Jul 1, 2019–Oct 31, 2019'];
    this.tabOptionsSubTitle = ['Date through Oct 4, 2018', 'Date through Oct 4, 2019'];
  }

  ngOnInit() {
    this.currentSummary = null;
    this.tabInfo();
  }
  tabInfo() {
    if (this.newPaymentIntegrityService.tabInfo()) {
      this.newPaymentIntegrityService.tabInfo().then((response: any) => {
        for (let i = 0; i < response.length; i++) {
          this.tabOptionsTitle[response[i].TabOrder - 1] = response[i].date;
          if (response[i].Active === 'Y') {
            this.printDateTitle = this.tabOptionsTitle[response[i].TabOrder - 1];
            this.printDateSubTitle = this.tabOptionsSubTitle[i];
            this.previousSelectedTab = i;
          }
        }
        this.newPaymentIntergrity();
      });
    }
  }

  getTabOptionsTitle(i: number) {
    return this.tabOptionsTitle[i];
  }
  matOptionClicked(i: number, event: any) {
    this.printDateTitle = this.tabOptionsTitle[i];
    this.printDateSubTitle = this.tabOptionsSubTitle[i];
    this.currentSummary = [];
    this.currentSummary = this.summaryItems;
    const myTabs = document.querySelectorAll('ul.nav-tabs > li');
    for (let j = 0; j < myTabs.length; j++) {
      myTabs[j].classList.remove('active');
    }
    myTabs[i].classList.add('active');
    this.previousSelectedTab = i;
  }
  newPaymentIntergrity() {
    this.tabOptions = [];
    let temp;
    temp = [
      {
        id: 0,
        title: this.getTabOptionsTitle(0),
        value1: '',
        sdata: null
      },
      {
        id: 1,
        title: this.getTabOptionsTitle(1),
        value1: 'Claims Processed through Oct 4, 2019', // 'Claims Processed through Oct 31, 2020',
        sdata: null
      }
    ];
    this.tabOptions = temp;
    this.summaryItems = [
      {
        category: 'app-card',
        type: 'donutWithSideBottomLabel',
        title: 'Medical Records Requested by UHC',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityRecordsRequested,
        data: {
          graphValues: [1100, 22000],
          centerNumber: '5%',
          centerData: 'of Claims Submitted',
          color: ['#3381FF', '#D7DCE1'],
          gdata: ['card-inner', 'totalClaimsSubmitted'],
          sdata: {
            sign: 'down-green',
            data: '-1.2%*'
          },
          labels: ['Records Requested', 'Claims Submitted'],
          hover: true
        },
        besideData: {
          labels: ['Medical Records Requested', 'Claims Submitted'],
          color: ['#3381FF', '#D7DCE1']
        },
        bottomData: {
          horizontalData: [
            {
              labels: '*Positive/negative trend comparision is Jun 2019 vs. Jul 2019'
            }
          ]
        }
      },
      {
        title: 'Coding Review Results',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
        data: {
          type: 'bar chart',
          cdata: 'paymentintegrity',
          graphValues: [92, 8],
          barText: 'Accurate Codes',
          hoverData: '699/760 Reviewed',
          barValue: '92%',
          color: ['#00B8CC', '#FFFFFF', '#E0E0E0'],
          gdata: ['app-card-structure', 'pi-bar-chart'],
          hover: true,
          targetValue: '2% above target'
        }
      },
      {
        title: 'Medical Records Received vs. Awaiting Submission',
        MetricID: this.MetricidService.MetricIDs.PaymentIntegrityCodeReviewResults,
        data: {
          type: 'large bar chart',
          cdata: 'paymentintegrity',
          graphValues: [69, 31],
          barText: 'Records Received',
          hoverData: '699/760 Requested',
          color: ['#00B8CC', '#FFFFFF', '#E91B18'],
          gdata: ['app-card-structure', 'pi-large-bar-chart'],
          hover: true,
          targetValue: '16% below target',
          trendValue: '+1.2%'
        },
        timeperiod: this.session.filterObjValue.timeFrame
      }
    ];
    this.currentSummary = this.summaryItems;
  }
}
