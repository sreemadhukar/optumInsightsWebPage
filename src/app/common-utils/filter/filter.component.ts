import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatInput } from '@angular/material';
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
  public taxArrayDataWithoutSymbols = [];
  public scArrayData = [];
  public timeframeData: any;
  public filterData: any;
  public scTypeData: string;
  public sctypearrowmark: boolean;
  filteredOptions: Observable<any[]>;
  public serviceCategoryCtrl = new FormControl();

  @Output() filterFlag = new EventEmitter();
  @Input() filterurl;
  public timeframes = [
    'Last 30 Days',
    'Last 3 Months',
    'Last 6 Months',
    'Last 12 Months',
    'Year to Date',
    '2018',
    '2017'
  ];
  public lobs = ['All', 'Community & State', 'Employer & Individual', 'Medicare & Retirement'];
  public servicesettings = ['All', 'Inpatient', 'Outpatient', 'Outpatient Facility'];
  public priorauthdecisiontype = ['All', 'Administrative', 'Clinical'];
  public priorauthservicecategory = [
    'All',
    'Medical',
    'Surgical',
    'Maternity',
    'Transplant',
    'Cosmetic / Reconstructive',
    'Mental Health',
    'Ambulance Air/Water',
    'Chiropractic',
    'Dental',
    'Diagnostic Testing',
    'Durable Medical Equipment',
    'Hospice',
    'Imaging',
    'Infertility Benefit Interpretation',
    'Infusion Services',
    'Lab',
    'Long Term Care',
    'Medications',
    'NICU',
    'Occupational Therapy',
    'Orthotics',
    'Pain Management',
    'Pharmacy',
    'Physical Therapy',
    'Podiatry',
    'Private Duty Nursing',
    'Prosthetics',
    'Rehabilitation',
    'Respiratory Therapy',
    'Skilled Nursing',
    'Speech Therapy',
    'Substance Use Disorder',
    'Supplies',
    'Therapy Services',
    'Transport',
    'Unproven, Experimental, Investigational',
    'Transplant Services',
    'Vision',
    'Well Baby (eNtf Only)',
    'Home Services',
    'Long Term Acute Care',
    'Intensive Service Delivery',
    'Cardiac Rehabilitation',
    'Dialysis',
    'PAT Skilled Nursing',
    'Home and Community Based Services',
    'Ambulatory Surgical Center',
    'Facility Based Service',
    'Custodial',
    'Weight Management'
  ];
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
      this.taxData = this.session.filterObjValue.taxwithSymbols.join(', ');
      this.inputDisplay = true;
      this.taxArrayData = this.session.filterObjValue.taxwithSymbols;
      this.taxArrayDataWithoutSymbols = this.session.filterObjValue.tax;
    } else if (this.session.filterObjValue.tax.length === 1) {
      this.taxData = this.session.filterObjValue.taxwithSymbols[0];
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
    this.sctypearrowmark = false;
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
      this.sctypearrowmark = false;
    } else if (value === 'lob') {
      this.arrowmark = !this.arrowmark;
      this.tarrowmark = false;
      this.tiarrowmark = false;
      this.ssarrowmark = false;
      this.patypearrowmark = false;
      this.sctypearrowmark = false;
    } else if (value === 'timeframe') {
      this.tiarrowmark = !this.tiarrowmark;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.ssarrowmark = false;
      this.patypearrowmark = false;
      this.sctypearrowmark = false;
    } else if (value === 'servicesetting') {
      this.ssarrowmark = !this.ssarrowmark;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.tiarrowmark = false;
      this.patypearrowmark = false;
      this.sctypearrowmark = false;
    } else if (value === 'priorauthtype') {
      this.patypearrowmark = !this.patypearrowmark;
      this.ssarrowmark = false;
      this.arrowmark = false;
      this.tarrowmark = false;
      this.tiarrowmark = false;
      this.sctypearrowmark = false;
    } else if (value === 'sctype') {
      this.sctypearrowmark = !this.sctypearrowmark;
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
      if (this.session.filterObjValue.scType) {
        this.scTypeData = this.session.filterObjValue.scType;
      } else {
        this.scTypeData = this.priorauthservicecategory[0];
      }
      this.filteredOptions = this.serviceCategoryCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
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
    this.session.filterObjValue.taxwithSymbols = ['All'];

    this.taxData = 'All';
    if (this.priorAuthorizationCustomFilterBool) {
      this.session.filterObjValue.serviceSetting = this.servicesettings[0];
      this.session.store({
        timeFrame: this.timeframes[0],
        lob: this.lobs[0],
        tax: ['All'],
        serviceSetting: this.servicesettings[0],
        priorAuthType: this.priorauthdecisiontype[0],
        scType: this.priorauthservicecategory[0]
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
          taxwithSymbols: this.taxArrayData,
          tax: this.taxArrayDataWithoutSymbols,
          serviceSetting: this.serviceSettingData,
          priorAuthType: this.priorAuthTypeData,
          scType: this.scTypeData
        });
      } else {
        this.session.store({
          timeFrame: this.timeframeData,
          lob: this.lobData,
          taxwithSymbols: this.taxArrayData,
          tax: this.taxArrayDataWithoutSymbols
        });
      }
    } else {
      // this.session.filterObjValue.tax = [this.taxData];
      if (this.priorAuthorizationCustomFilterBool) {
        this.session.store({
          timeFrame: this.timeframeData,
          lob: this.lobData,
          tax: [this.taxData],
          taxwithSymbols: [this.taxData],
          serviceSetting: this.serviceSettingData,
          priorAuthType: this.priorAuthTypeData,
          scType: this.scTypeData
        });
      } else {
        this.session.store({
          timeFrame: this.timeframeData,
          lob: this.lobData,
          tax: [this.taxData],
          taxwithSymbols: [this.taxData]
        });
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
    const baseArray = [];

    tempArray.forEach(element => {
      baseArray.push(element.replace('-', ''));
    });
    this.taxArrayDataWithoutSymbols = baseArray.filter((el, i, a) => i === a.indexOf(el));
  }
  scArrayFunction(data) {
    let tempArray = [];
    if (data) {
      this.scTypeData = data;
    } else {
      this.scTypeData = 'All';
    }

    tempArray = data.split(', ');
    this.scArrayData = tempArray.filter((el, i, a) => i === a.indexOf(el));
  }
  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.priorauthservicecategory.filter(
      servicecategory => servicecategory.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
