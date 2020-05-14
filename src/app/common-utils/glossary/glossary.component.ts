import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { GlossarySharedService } from 'src/app/shared/glossary.service';

@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit, DoCheck {
  public glossaryList: any;
  public glossarySelected = [];
  public glossaryData: any[];
  public options: string[];
  public glossaryTitleShow: String = '';
  public filteredOptions: Observable<any[]>;
  public glossaryCtrl = new FormControl();
  public metricDataList: any[];
  public allmetrics = false;
  public allmetricsdefinitionShort = [];
  public readmoreFlag = [];
  public optionLength = 0;
  public optionND = false;
  public split: any;
  public hyperlink: any;
  public definition: any;
  public paperlessDelivaryFlag = true;
  public toHighlight = '';
  public internal = environment.internalAccess;
  @Input() title: string;
  @Input() MetricID: string;
  constructor(private readonly glossarySharedService: GlossarySharedService, private readonly router: Router) {}

  checkIfKOP() {
    return this.router.url.includes('NationalExecutive') ? true : false;
  }

  ngOnInit() {
    this.glossarySelected = [];
    const isKop = this.checkIfKOP();
    this.getGlossaryData({ kop: isKop });
    this.options = [];
  }

  ngDoCheck() {
    // this.networkLeverUlTag();
  }

  public networkLeverUlTag() {
    setTimeout(function() {
      const a: any = document.querySelectorAll('.network-lever-ul');
      a[0].style.paddingLeft = '30px';
      const x = Array.from(a[0].children as HTMLCollectionOf<HTMLElement>);
      x.forEach(element => {
        element.style.listStyle = 'disc';
      });
    }, 1);
  }

  public async getGlossaryData({ kop }) {
    this.glossaryList = await this.glossarySharedService.getData({ kop });

    if (!(this.glossaryList instanceof Array) || this.glossaryList.length === 0) {
      return;
    }

    for (let i = 0; i < this.glossaryList.length; i++) {
      this.readmoreFlag[i] = true;
      if (this.glossaryList[i].MetricID === 301 && this.paperlessDelivaryFlag) {
        this.paperlessDelivaryFlag = false;
        this.hyperlink = this.glossaryList[i].Definition.substring(this.glossaryList[i].Definition.indexOf('http'));
        this.split = this.glossaryList[i].Definition.substring(this.glossaryList[i].Definition.indexOf('Learn'));
        this.definition = this.glossaryList[i].Definition.replace(this.split, '');
        this.split = this.split.replace(this.hyperlink, '');
        this.glossaryList[i].Definition = this.definition;
      }
    }

    if (this.title === 'Medicare Star Rating') {
      this.title = 'Medicare Average Star Rating';
    }

    this.glossarySelected = this.glossaryList.filter((glossaryItem: any) => {
      const { MetricID, Metric } = glossaryItem;

      let metricIdExists = false;
      if (this.MetricID) {
        const metricIds = this.MetricID.split(',');
        metricIdExists = metricIds.filter((metricId: string) => {
          return metricId.toString() === MetricID.toString();
        })[0]
          ? true
          : false;
      }

      const metricName = this.title;
      const metricNameExists = Metric.toUpperCase().includes(metricName.toUpperCase());
      return metricNameExists || metricIdExists ? true : false;
    });

    this.glossaryData = this.glossaryList.sort(function(a, b) {
      if (a.Metric.toLowerCase() < b.Metric.toLowerCase()) {
        return -1;
      } else if (a.Metric.toLowerCase() > b.Metric.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    for (let i = 0; i < this.glossaryList.length; i++) {
      this.options.push(this.glossaryList[i].Metric);
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
        if (this.glossaryList[s].Metric.startsWith(bigChar)) {
          results[bigChar].push(this.glossaryList[s].Metric);
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
  }

  public filteredData(value) {
    if (value === 'All') {
      for (let i = 0; i < this.glossaryList.length; i++) {
        if (this.getTextWidth(this.glossaryList[i].Definition, 16, 'Arial') > 680) {
          this.allmetricsdefinitionShort.push(this.glossaryList[i].Definition.slice(0, 90) + '...');
        } else {
          this.allmetricsdefinitionShort.push(null);
        }
      }
      this.allmetrics = true;
      this.glossarySelected = this.glossaryList;
    } else {
      this.allmetrics = false;
      for (let i = 0; i < this.glossaryList.length; i++) {
        if (this.glossaryList[i].Metric === value) {
          this.glossarySelected = [];
          this.glossarySelected = [this.glossaryList[i]];
          this.hyperlink = '';
          if (this.glossarySelected[0].MetricID === 301 && this.paperlessDelivaryFlag) {
            this.paperlessDelivaryFlag = false;
            this.hyperlink = this.glossarySelected[0].Definition.substring(
              this.glossarySelected[0].Definition.indexOf('http')
            );
            this.split = this.glossarySelected[0].Definition.substring(
              this.glossarySelected[0].Definition.indexOf('Learn')
            );
            this.definition = this.glossarySelected[0].Definition.replace(this.split, '');
            this.split = this.split.replace(this.hyperlink, '');
            this.glossarySelected[0].Definition = this.definition;
          }
          break;
        } // end if structure for glossaryList
      } // end for loop
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
      // if (value > this.readmoreFlag.length - 4) {
      //   document.getElementById('metrics-div').style.padding = '0 0 480px 0';
      //   document.getElementById('side-nav-glossary').scrollTo(0, 208 + 160 * value);
      // } else {
      //   document.getElementById('side-nav-glossary').scrollTo(0, 208 + 160.5 * value);
      //   document.getElementById('metrics-div').style.padding = '0 0 100px 0';
      // }
      // window.scrollTo(300, 0);
      // uncoment if business glossary auto scroll to top need to work
      // -- please comment overflow-x: hidden !important; in class mat-drawer-inner-container --hamburger-menu.scss
    } else {
      document.getElementById('metrics-div').style.padding = '0 0 100px 0';
      this.readmoreFlag[value] = true;
      document.getElementById('each-metric-div' + value).classList.add('each-metric-div');
    }
  }
  private getTextWidth(text, fontSize, fontFace) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontSize + 'px ' + fontFace;
    return context.measureText(text).width;
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
}
