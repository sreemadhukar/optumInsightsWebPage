import { Component, OnInit, Input, ViewChild } from '@angular/core';
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
  filteredOptions: Observable<any[]>;
  public glossaryCtrl = new FormControl();
  metricDataList: any[];
  public singlemetric = true;
  public allmetrics = false;
  public readmoreFlag = [];
  public optionLength = 0;
  public optionND = false;
  public toHighlight = '';
  public internal = environment.internalAccess;
  @Input() title;
  constructor(private glossaryService: GlossaryService) {}
  ngOnInit() {
    this.options = [];
    this.glossarySelected = [];
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.glossaryList = JSON.parse(JSON.stringify(response));
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
      if (this.glossarySelected) {
        if (this.glossarySelected.length > 1 && document.body.clientHeight < 1100) {
          this.singlemetric = false;
        } else {
          this.singlemetric = true;
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
    this.singlemetric = true;
    if (value === 'All') {
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
      this.readmoreFlag[value] = false;
      document.getElementById('each-metric-div' + value).classList.remove('each-metric-div');
    } else {
      this.readmoreFlag[value] = true;
      document.getElementById('each-metric-div' + value).classList.add('each-metric-div');
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
