import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  glossaryList: any;
  glossarySelected = [];
  glossaryData: any[];
  public options: string[];
  glossaryTitleShow: String = '';
  selectedmetric = '';
  viewallmetricsbuttonposition = true;
  filteredOptions: Observable<any[]>;
  public glossaryCtrl = new FormControl();
  metricDataList: any[];
  public allmetrics = false;
  public allmetricsdefinitionShort = [];
  public readmoreFlag = [];
  public optionLength = 0;
  public optionND = false;
  public toHighlight = '';
  public internal = environment.internalAccess;
  @Input() title;
  constructor(private glossaryService: GlossaryService) {}
  ngOnInit() {
    console.log(this.title);
    this.options = [];
    this.glossarySelected = [];
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.glossaryList = JSON.parse(JSON.stringify(response));
      if (this.title === 'Medicare Star Rating') {
        this.title = 'Medicare & Retirement Average Star Rating';
      } else if (this.title === 'Claims Appeals Overturned Rate') {
        this.title = 'Claim Appeals Overturn Rate';
      } else if (this.title === 'Top Claims Appeals Overturn Reasons') {
        this.title = 'Top Claim Appeals Overturn Reasons';
      } else if (this.title === 'Claims Appeals Overturned') {
        this.title = 'Claim Appeals Overturned';
      }

      if (this.glossaryList) {
        for (let i = 0; i < this.glossaryList.length; i++) {
          this.readmoreFlag[i] = true;
          this.glossaryList[i].BusinessGlossary.ProviderDashboardName.metricData = this.glossaryList[
            i
          ].BusinessGlossary.ProviderDashboardName.Metric.replace(/[^a-zA-Z]/g, '');
          if (
            this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric.toLowerCase().includes(
              this.title.toLowerCase()
            )
          ) {
            this.glossarySelected.push(this.glossaryList[i]);
          }
        }
      }
      //  madhukar
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

  public filteredData(value) {
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
      this.selectedmetric = null;
      this.allmetrics = true;
      this.glossarySelected = this.glossaryList;
    } else {
      this.allmetrics = false;
      for (let i = 0; i < this.glossaryList.length; i++) {
        if (this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric === value) {
          this.glossarySelected = [this.glossaryList[i]];
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
      this.selectedmetric = '';
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
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) {
      this.viewallmetricsbuttonposition = false;
    } else {
      this.viewallmetricsbuttonposition = true;
    }
  }

  private _filter(value: string): string[] {
    if (value != undefined && value != null && value) {
      const filterValue = value.toLowerCase();
      this.toHighlight = value;
      const optionsData = this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0).slice(0, 5);
      this.optionLength = optionsData.length;
      if (this.optionLength === 0) {
        this.optionND = true;
      } else {
        this.optionND = false;
        return optionsData;
      }
    }
  }
} // end export class
