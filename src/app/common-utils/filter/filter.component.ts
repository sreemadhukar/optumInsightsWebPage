import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  public lobData: string;
  public serviceSettingData: string;
  public priorAuthTypeData: string;
  public arrowmark: boolean;
  public taxData: string;
  public tarrowmark: boolean;
  public tiarrowmark: boolean;
  public ssarrowmark: boolean;
  public patypearrowmark: boolean;
  public tinsData: any;
  public taxValue: string;
  public inputDisplay = false;
  // prior auth has 3 unique filters so make one bool
  public priorAuthorizationCustomFilterBool = false;
  public taxArrayData = [];
  public timeframeData: any;
  public filterData: any;
  @Output() filterFlag = new EventEmitter();
  @Input() filterurl;
  public timeframes = ['Last 6 Months', 'Last 12 Months', 'Year to Date', '2018', '2017'];
  public lobs = ['All', 'Community & State', 'Employee & Individual', 'Medicare & Retirement'];
  public servicesettings = ['All', 'Inpatient', 'Outpatient', 'Outpatient Facility'];
  public priorauthdecisiontype = ['All', 'Administrative', 'Clinical'];
  public priorauthservicecategory = ['All'];
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private session: SessionService,
    private location: Location
  ) {
    this.timeframeData = this.session.filterObjValue.timeFrame;
    this.lobData = this.session.filterObjValue.lob;
    this.arrowmark = false;
    if (this.session.filterObjValue.tax.length > 1) {
      this.taxData = this.session.filterObjValue.tax.join(', ');
      this.inputDisplay = true;
      this.taxArrayData = this.session.filterObjValue.tax;
    } else if (this.session.filterObjValue.tax.length === 1) {
      this.taxData = this.session.filterObjValue.tax[0];
      if (this.session.filterObjValue.tax[0] !== 'All') {
        this.inputDisplay = true;
      } else {
        this.inputDisplay = false;
      }
    }

    this.tarrowmark = false;
    this.tiarrowmark = false;
    this.ssarrowmark = false;
    this.patypearrowmark = false;
    iconRegistry.addSvgIcon(
      'arrowdn',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'arrowup',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_up-24px.svg')
    );
  }
  public clickArrowMark(value) {
    if (value === 'tax') {
      this.tarrowmark = !this.tarrowmark;
      this.arrowmark = false;
      this.taxValue = '';
      this.tiarrowmark = false;
      this.ssarrowmark = false;
      this.patypearrowmark = false;
    } else if (value === 'lob') {
      this.arrowmark = !this.arrowmark;
      this.tarrowmark = false;
      this.tiarrowmark = false;
      this.ssarrowmark = false;
      this.patypearrowmark = false;
    } else if (value === 'timeframe') {
      this.tiarrowmark = !this.tiarrowmark;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.ssarrowmark = false;
      this.patypearrowmark = false;
    } else if (value === 'servicesetting') {
      this.ssarrowmark = !this.ssarrowmark;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.tiarrowmark = false;
      this.patypearrowmark = false;
    } else if (value === 'priorauthtype') {
      this.patypearrowmark = !this.patypearrowmark;
      this.ssarrowmark = false;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.tiarrowmark = false;
    }
  }
  ngOnInit() {
    if (this.location.path() === '/CareDelivery/priorAuth') {
      this.priorAuthorizationCustomFilterBool = true;
      if (this.session.filterObjValue.serviceSetting) {
        this.serviceSettingData = this.session.filterObjValue.serviceSetting;
      } else {
        this.serviceSettingData = this.servicesettings[0];
      }
      if (this.session.filterObjValue.priorAuthType) {
        this.priorAuthTypeData = this.session.filterObjValue.priorAuthType;
      } else {
        this.priorAuthTypeData = this.priorauthdecisiontype[0];
      }
    } else {
      this.priorAuthorizationCustomFilterBool = false;
    }
    this.lobData = this.session.filterObjValue.lob;
    this.session.getTins().then(data => {
      this.tinsData = data;
      this.tinsData.forEach(value => {
        value['checked'] = false;
        if (this.taxArrayData.includes(value['Tin'])) {
          value['checked'] = true;
        }
      });
    });
  }
  resetFilter() {
    this.session.filterObjValue.lob = this.lobData = this.lobs[0];
    this.session.filterObjValue.timeFrame = this.timeframeData = this.timeframes[0];
    this.session.filterObjValue.tax = ['All'];
    this.taxData = 'All';
    if (this.priorAuthorizationCustomFilterBool) {
      this.session.filterObjValue.serviceSetting = this.servicesettings[0];
      this.session.store({
        timeFrame: this.timeframes[0],
        lob: this.lobs[0],
        tax: ['All'],
        serviceSetting: this.servicesettings[0],
        priorAuthType: this.priorauthdecisiontype[0]
      });
    } else {
      this.session.store({ timeFrame: this.timeframes[0], lob: this.lobs[0], tax: ['All'] });
    }
    this.filterFlag.emit(false);
  }
  applyFilter() {
    if (this.taxArrayData.length > 0) {
      //  this.session.filterObjValue.tax = this.taxArrayData;
      if (this.priorAuthorizationCustomFilterBool) {
        this.session.store({
          timeFrame: this.timeframeData,
          lob: this.lobData,
          tax: this.taxArrayData,
          serviceSetting: this.serviceSettingData,
          priorAuthType: this.priorAuthTypeData
        });
      } else {
        this.session.store({ timeFrame: this.timeframeData, lob: this.lobData, tax: this.taxArrayData });
      }
    } else {
      // this.session.filterObjValue.tax = [this.taxData];
      if (this.priorAuthorizationCustomFilterBool) {
        this.session.store({
          timeFrame: this.timeframeData,
          lob: this.lobData,
          tax: [this.taxData],
          serviceSetting: this.serviceSettingData,
          priorAuthType: this.priorAuthTypeData
        });
      } else {
        this.session.store({ timeFrame: this.timeframeData, lob: this.lobData, tax: [this.taxData] });
      }
    }
    this.session.filterObjSubject.complete();
    this.filterFlag.emit(false);
  }
  focusFunction(searchValue: string) {
    if (searchValue) {
      this.taxValue = searchValue;
      this.inputDisplay = !this.inputDisplay;
    }
  }
  taxArrayFunction(data) {
    let tempArray = [];
    if (data) {
      this.taxData = data;
    } else {
      this.taxData = 'All';
    }

    tempArray = data.split(', ');
    this.taxArrayData = tempArray.filter((el, i, a) => i === a.indexOf(el));
  }
}
