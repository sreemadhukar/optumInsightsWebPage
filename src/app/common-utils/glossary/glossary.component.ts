import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlossaryService } from './../../rest/glossary/glossary.service';
import { catchError } from 'rxjs/operators';
import { MatIconRegistry, MatDialogRef, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  glossaryList: any;
  public glossaryFlag: boolean;
  glossarySelected = [];
  glossaryData: any[];
  public options: string[];
  glossaryTitleShow: String = '';
  filteredOptions: Observable<any[]>;
  glossaryCtrl = new FormControl();
  metricDataList: any[];
  public optionLength = 0;
  public optionND = false;
  public toHighlight = '';
  @Input() title;

  constructor(private glossaryService: GlossaryService) {
    this.glossaryFlag = false;
  }

  ngOnInit() {
    this.options = [];
    this.glossaryService.getBusinessGlossaryData().subscribe(response => {
      this.glossaryList = JSON.parse(JSON.stringify(response));
      for (let i = 0; i < this.glossaryList.length; i++) {
        this.glossaryList[i].BusinessGlossary.ProviderDashboardName.metricData = this.glossaryList[
          i
        ].BusinessGlossary.ProviderDashboardName.Metric.replace(/[^a-zA-Z]/g, '');
        if (this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric === this.title) {
          this.glossarySelected = [this.glossaryList[i]];
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
          map(value => this._filter(value))
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
        // console.log(this.metricDataList);
      });
    });
  }
  public filteredData(value) {
    for (let i = 0; i < this.glossaryList.length; i++) {
      if (this.glossaryList[i].BusinessGlossary.ProviderDashboardName.Metric === value) {
        this.glossarySelected = [this.glossaryList[i]];
      }
    }
    console.log(this.glossarySelected);
  }
  closeGlossary() {
    this.glossaryFlag = false;
  }
  private _filter(value: string): string[] {
    if (value != undefined) {
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
