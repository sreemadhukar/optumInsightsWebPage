import { Component, OnInit, Input, Output, ElementRef, Renderer2, EventEmitter, AfterViewInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
@Component({
  selector: 'app-accordion-large-card',
  templateUrl: './accordion-large-card.component.html',
  styleUrls: ['./accordion-large-card.component.scss']
})
export class AccordionLargeCardComponent implements OnInit, AfterViewInit {
  @Input() data;
  @Input() qualityMesaureStarData: any;
  @Input() skeletonLarge;
  section: any = [];
  @Input() x;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();
  type: any;
  public chartData: any;

  qualityMeasureList = [
    {
      startitle: 'One Star Quality Measures',
      maintitle: 'C07-Adult BMI Assessment',
      cmsweight: 1,
      starRating: 1,
      description:
        'The percent of women 50-74 years of age who had a mammogram to screen for breast cancer in last 27 reported months.'
    },
    {
      startitle: 'One Star Quality Measures',
      maintitle: 'C08-Adult BMI Assessment',
      cmsweight: 1,
      starRating: 5,
      description:
        'The percent of women 50-74 years of age who had a mammogram to screen for breast cancer in last 27 reported months.'
    },
    {
      startitle: 'One Star Quality Measures',
      maintitle: 'C08-Adult BMI Assessment',
      cmsweight: 1,
      starRating: 2,
      description:
        'Measure Description:  Lorem ipsum dolor sit amet, consectetur adipiscing elit' +
        'Praesent id lorem sit amet enim feugiat malesuada. Mauris in aliquet nunc.'
    }
  ];
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private elementRef: ElementRef,
    private renderer: Renderer2
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
    this.glossaryExpandService.setMessage(title);
  }

  ngOnInit() {
    this.chartData = JSON.parse(JSON.stringify(this.data[0]));
    console.log('app-large-card' + this.chartData);
  }
  ngAfterViewInit() {
    this.chartData = JSON.parse(JSON.stringify(this.data));
    console.log('app-large-card' + this.chartData);
  }
  reasonsCollapose(x: Number) {
    this.x = x;
    for (let i = 0; i < this.section.length; i++) {
      if (i !== x) {
        this.section[i] = false;
      }
    }
    // this.ratingClick.emit({
    //   starCountNo: this.starCountNo,
    //   rating: x
    // });
  }

  sortHeader(event) {
    const listItems = this.elementRef.nativeElement.querySelectorAll('.sort-header-icon') as HTMLElement[];
    Array.from(listItems).forEach(listItem => {
      this.renderer.setStyle(listItem, 'color', '#757588');
    });
    this.type = event.direction;
  }
}
