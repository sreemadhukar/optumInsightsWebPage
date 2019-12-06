import { Component, OnInit, Input, HostListener, ViewChild, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { GlossaryService } from './../../rest/glossary/glossary.service';
import { catchError } from 'rxjs/operators';
import { MatInput } from '@angular/material';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  protected emitter = new EventEmitter<string>();
  public obs: Subscription;
  glossaryList: any;
  glossarySelected = [];
  glossaryData: any[];
  public options: string[];
  glossaryTitleShow: String = '';
  viewallmetricsbuttonposition = true;
  filteredOptions: Observable<any[]>;
  public glossaryCtrl = new FormControl();
  metricDataList: any[];
  public allmetrics = false;
  public allmetricsdefinitionShort = [];
  public readmoreFlag = [];
  public optionLength = 0;
  public optionND = false; // boolean will set to true when data not available
  split: any;
  hyperlink: any;
  definition: any;
  public toHighlight = ''; // to highlight the value entered by user
  public internal = environment.internalAccess;
  @Input() title; // which we recieve from card -> common-header component
  @Input() MetricID; // which we recieve from corresponsding card shared files
  constructor(private glossaryService: GlossaryService) {}

  ngOnInit() {
    this.glossarySelected = [];
    if (this.MetricID) {
      this.glossaryByMetricId();
    }
    this.obs = this.emitter.pipe(debounceTime(250)).subscribe(text => this.getBusinessGlossary(text));
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.options = [];
      this.glossarySelected = [];
      this.glossaryList = JSON.parse(JSON.stringify(response));
      if (this.title === 'Medicare Star Rating') {
        this.title = 'Medicare & Retirement Average Star Rating';
      }
      // if id not exist in metricId table/database then we chose by title i.e. is includes()
      if (this.glossaryList) {
        if (this.glossarySelected.length === 0) {
          for (let i = 0; i < this.glossaryList.length; i++) {
            if (
              this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric.toLowerCase().includes(
                this.title.toLowerCase()
              )
            ) {
              this.glossarySelected.push(this.glossaryList[i]);
            }
          }
        }
      }

      this.glossaryData = this.glossaryList.sort(function(a, b) {
        if (
          a.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase() <
          b.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase()
        ) {
          return -1;
        } else if (
          a.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase() >
          b.BusinessGlossary.ProviderDashboardName.Metric.toLowerCase()
        ) {
          return 1;
        } else {
          return 0;
        }
      });

      for (let i = 0; i < this.glossaryList.length; i++) {
        this.options.push(this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric);
      }
      if (this.options.length) {
        this.filteredOptions = this.glossaryCtrl.valueChanges.pipe(
          startWith(''),
          map(value => (value ? this._filter(value) : null))
        );
      }
      const results = {};
      this.metricDataList = [];

      for (let i = 0; i < 26; i++) {
        const char = String.fromCharCode(97 + i);
        const bigChar = char.toUpperCase();
        results[bigChar] = [];
        for (let s = 0; s < this.glossaryList.length; s++) {
          if (this.glossaryList[s].BusinessGlossary.ProviderDashboardName.Metric.startsWith(bigChar)) {
            results[bigChar].push(this.glossaryList[s].BusinessGlossary.ProviderDashboardName.Metric);
          }
        }
      }

      Object.keys(results).forEach(key => {
        const mdata = [];
        for (let j = 0; j < results[key].length; j++) {
          mdata.push(results[key][j].replace(/[^a-zA-Z]/g, ''));
        }
        if (mdata.length > 0) {
          this.metricDataList.push({ key: key, value: results[key], rdata: mdata });
        }
      });
    });
  }

  // this funtion will trigger on keyup for search function
  public checkInput(val) {
    if (val !== '') {
      this.emitter.emit(val);
    }
  }

  // this function will fetch all the matched glossary items only corresponding to the characters entered by user
  public getBusinessGlossary(text) {
    // this.glossaryService.getGlossaryByMetricName(text).subscribe(
    //   response => {
    //     console.log('Business Glossary metric name', response);
    //   },
    //   err => {
    //     console.log('Error in getBusinessGlossary', err);
    //   }
    // );
  }

  // this function will fetch the glossary item corresponding to the card
  public glossaryByMetricId() {
    this.glossaryService.getGlossaryMetricID(this.MetricID).subscribe(
      response => {
        if ((response || {}).BusinessGlossary) {
          this.glossarySelected.push(response);
          this.hyperlink = '';
          if (this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.MetricID === 301) {
            this.hyperlink = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.substring(
              this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.indexOf('http')
            );
            this.split = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.substring(
              this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.indexOf('Learn')
            );
            this.definition = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.replace(
              this.split,
              ''
            );
            this.split = this.split.replace(this.hyperlink, '');
            this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition = this.definition;
          }
        }
      },
      err => {
        console.log('Business Glossary Metric ID Error', err);
      }
    );
  }

  public filteredData(value) {
    this.glossarySelected = [];
    if (value === 'All') {
      for (let i = 0; i < this.glossaryList.length; i++) {
        if (
          this.getTextWidth(this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Definition, 16, 'Arial') > 680
        ) {
          this.allmetricsdefinitionShort.push(
            this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Definition.slice(0, 90) + '...'
          );
        } else {
          this.allmetricsdefinitionShort.push(null);
        }
      }
      this.allmetrics = true;
      this.glossarySelected = this.glossaryList;
    } else {
      this.allmetrics = false;
      for (let i = 0; i < this.glossaryList.length; i++) {
        if (this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric === value) {
          this.glossarySelected = [this.glossaryList[i]];
          this.hyperlink = '';
          if (this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.MetricID === 301) {
            this.hyperlink = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.substring(
              this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.indexOf('http')
            );
            this.split = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.substring(
              this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.indexOf('Learn')
            );
            this.definition = this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition.replace(
              this.split,
              ''
            );
            this.split = this.split.replace(this.hyperlink, '');
            this.glossarySelected[0].BusinessGlossary.ProviderDashboardName.Definition = this.definition;
          }
        }
      }
    }
  }

  public readmore(value) {
    for (let i = 0; i < this.readmoreFlag.length; i++) {
      if (i !== value) {
        this.readmoreFlag[i] = true;
        document.getElementById('each-metric-div' + i).classList.add('each-metric-div');
      }
    }
    if (this.readmoreFlag[value]) {
      document.getElementById('each-metric-div' + value).classList.remove('each-metric-div');
      this.readmoreFlag[value] = false;
      if (value > this.readmoreFlag.length - 4) {
        document.getElementById('metrics-div').style.padding = '0 0 480px 0';
        document.getElementById('side-nav-glossary').scrollTo(0, 208 + 160 * value);
      } else {
        document.getElementById('side-nav-glossary').scrollTo(0, 208 + 160.5 * value);
        document.getElementById('metrics-div').style.padding = '0 0 100px 0';
      }
      window.scrollTo(300, 0);
    } else {
      document.getElementById('metrics-div').style.padding = '0 0 100px 0';
      this.readmoreFlag[value] = true;
      document.getElementById('each-metric-div' + value).classList.add('each-metric-div');
    }
  }
  public getTextWidth(text, fontSize, fontFace) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontSize + 'px ' + fontFace;
    return context.measureText(text).width;
  }
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (window.innerHeight + document.documentElement.scrollTop >= document.body.offsetHeight - 80) {
      this.viewallmetricsbuttonposition = false;
    } else {
      this.viewallmetricsbuttonposition = true;
    }
  }

  private _filter(value: string): string[] {
    if (value != undefined && value != null && value) {
      const filterValue = value.toLowerCase();
      this.toHighlight = value;
      const myPattern = new RegExp('(\\w*' + filterValue + '\\w*)', 'gi');
      const optionsData = this.options.filter(option => option.match(myPattern) !== null);
      this.optionLength = optionsData.length;
      if (this.optionLength) {
        this.optionND = false;
        return optionsData;
      } else {
        // boolean set to true when data not available
        this.optionND = true;
      }
    }
  }
} // end export class
