import { Component, OnInit, Input, Output, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { CommonUtilsService } from '../../shared/common-utils.service';
@Component({
  selector: 'app-accordion-large-card',
  templateUrl: './accordion-large-card.component.html',
  styleUrls: ['./accordion-large-card.component.scss']
})
export class AccordionLargeCardComponent implements OnInit {
  @Input() data;
  @Input() title;
  @Input() qualityMeasure;
  @Input() skeletonLarge;
  section: any = [];
  subsection: any = [];
  hideplus: boolean;

  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
  type: any;
  public chartData: any;
  public cardTitle: String;
  public qualityPcorData: any;
  public qualitySubTitle: String;
  public qualityStarCount: Number;
  public compliantMemberCount: any;
  public eligibleMemberCount: any;
  public currentRateCalc: any;
  public currentRate: any;
  public cmsWeightdata: any;
  public ascendPCORDtata: any;
  showPlus: boolean;
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private common: CommonUtilsService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'open',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close-bar',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'asc-sort',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_up-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'desc-sort',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_down-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.data.MetricID);
  }
  nFormatter(num, digits) {
    const si = [
      { value: 1, symbol: '' },
      { value: 1e3, symbol: 'K' },
      { value: 1e6, symbol: 'M' },
      { value: 1e9, symbol: 'G' },
      { value: 1e12, symbol: 'T' },
      { value: 1e15, symbol: 'P' },
      { value: 1e18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
  }
  ngOnInit() {}
  reasonsCollapose(x: any) {
    this.subsection = [];
    for (let i = 0; i < this.section.length; i++) {
      if (i !== x) {
        this.section[i] = false;
      }
    }
    // function SortByName(x:any,y:any) {
    //     return ((x.Name == y.Name) ? 0 : ((x.Name > y.Name) ? 1 : -1 ));
    //   };

    const check = 5 - x;
    if (check === this.qualityMeasure[x].star) {
      const ref = {
        3: 0,
        2: 1,
        1: 2,
        0: 3
      };

      this.qualityStarCount = this.qualityMeasure[x].star;
      this.qualityPcorData = this.qualityMeasure[x].data;
      // .sort((a, b) => ref[a.CMSWeight] - ref[b.CMSWeight]);
      // console.log(this.qualityPcorData);

      // this.qualityPcorData.sort((a, b) => ref[a.Name] - ref[b.Name]);

      this.ascendPCORDtata = this.qualityPcorData.sort((a, b) =>
        a.CMSWeight < b.CMSWeight ? 1 : a.CMSWeight === b.CMSWeight ? (a.Name < b.Name ? 1 : -1) : -1
      );

      console.log('dfdfdf' + this.ascendPCORDtata);

      this.qualitySubTitle = this.qualityMeasure[x].label;

      this.subsection[0] = true;

      if (this.qualityMeasure[x].count === 0) {
        for (let i = 0; i < this.section.length; i++) {
          if (i === x) {
            this.section[i] = false;
          }
        }
      }
    }

    this.compliantMemberCount = this.ascendPCORDtata[0].CompliantMemberCount;
    this.eligibleMemberCount = this.ascendPCORDtata[0].EligibleMemberCount;
    this.currentRateCalc = this.common.nFormatter(
      ((this.compliantMemberCount / this.eligibleMemberCount) * 100).toFixed(0) + '%'
    );
  }
  subItemsCollapose(x: any) {
    for (let i = 0; i < this.subsection.length; i++) {
      if (i !== x) {
        this.subsection[i] = false;
      }
    }

    this.compliantMemberCount = this.ascendPCORDtata[x].CompliantMemberCount;
    this.eligibleMemberCount = this.ascendPCORDtata[x].EligibleMemberCount;
    this.currentRateCalc = this.common.nFormatter(
      ((this.compliantMemberCount / this.eligibleMemberCount) * 100).toFixed(0) + '%'
    );
    console.log(this.currentRateCalc);
  }
  sortHeader(event) {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.sort-header-icon') as HTMLElement[];
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'color', '#757588');
    });
    this.type = event.direction;
  }
}
