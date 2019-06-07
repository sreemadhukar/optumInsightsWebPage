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
  @Output() filterFlag = new EventEmitter();
  public lobs = ['All', 'Community & State', 'Employee & Individual', 'Medicare & Retirement'];
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private session: SessionService) {
    this.lobData = this.session.lob;
    this.arrowmark = false;
    iconRegistry.addSvgIcon(
      'arrowdn',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_down-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'arrowup',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-keyboard_arrow_up-24px.svg')
    );
  }
  public clickArrowMark() {
    this.arrowmark = !this.arrowmark;
  }
  ngOnInit() {
    this.lobData = this.session.lob;
  }
  resetFilter() {
    this.session.lob = this.lobData = this.lobs[0];
    this.filterFlag.emit(false);
  }
  applyFilter() {
    this.session.lob = this.lobData;
    this.filterFlag.emit(false);
  }
}
