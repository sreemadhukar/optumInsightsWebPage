import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  public lobData: string;
  public arrowmark: boolean;
  public taxData: string;
  public tarrowmark: boolean;
  public tiarrowmark: boolean;
  public tinsData: any;
  public taxValue: string;
  public inputDisplay = false;
  public taxArrayData = [];
  public timeframeData: any;
  @Output() filterFlag = new EventEmitter();
  public timeframes = ['Last 6 Months', 'Last 12 Months', 'Year to Date', '2018', '2017'];
  public lobs = ['All', 'Community & State', 'Employee & Individual', 'Medicare & Retirement'];
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private session: SessionService) {
    this.timeframeData = this.session.timeFrame;
    this.lobData = this.session.lob;
    this.arrowmark = false;
    this.taxData = this.session.tin;
    this.tarrowmark = false;
    this.tiarrowmark = false;
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
      this.inputDisplay = false;
      this.tiarrowmark = false;
    } else if (value === 'lob') {
      this.arrowmark = !this.arrowmark;
      this.tarrowmark = false;
      this.tiarrowmark = false;
    } else if (value === 'timeframe') {
      this.tiarrowmark = !this.tiarrowmark;
      this.arrowmark = false;
      this.tarrowmark = false;
    }
  }
  ngOnInit() {
    this.lobData = this.session.lob;
    this.session.getTins().then(data => {
      this.tinsData = data;
      this.tinsData.forEach(value => {
        value['checked'] = false;
      });
    });
  }
  resetFilter() {
    this.session.lob = this.lobData = this.lobs[0];
    this.filterFlag.emit(false);
  }
  applyFilter() {
    this.session.lob = this.lobData;
    this.session.timeFrame = this.timeframeData;
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
