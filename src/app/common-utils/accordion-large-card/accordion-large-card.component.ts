import { Component, OnInit, Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
@Component({
  selector: 'app-accordion-large-card',
  templateUrl: './accordion-large-card.component.html',
  styleUrls: ['./accordion-large-card.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('180ms ease-out')),
      transition('default => rotated', animate('180ms ease-in'))
    ])
  ]
})
export class AccordionLargeCardComponent implements OnInit {
  @Input() data: any;
  @Input() title: string;
  @Input() expandAll: any;
  @Input() skeletonLarge: any;
  subItemKey = 'qualityPcorData';
  subItemsExpanded: any = [];
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    this.iconRegistry.addSvgIcon(
      'help',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'open',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-add-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'close-bar',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-remove-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'asc-sort',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_up-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'desc-sort',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-arrow_drop_down-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'close',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-close-24px.svg')
    );

    iconRegistry.addSvgIcon(
      'carrot',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/keyboard_arrow_down-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'star-blue',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Toggle/star-black-18dp.svg')
    );
    iconRegistry.addSvgIcon(
      'star-grey',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Toggle/star-grey-18dp.svg')
    );
  }

  ngOnInit() {
    this.data.forEach(() => {
      this.subItemsExpanded.push(false);
    });
  }

  helpIconClick(title: string) {
    this.glossaryExpandService.setMessage(title, this.data.MetricID);
  }

  onClickExpandItem(itemIndex: number) {
    this.data[itemIndex].active = !this.data[itemIndex].active;
    if (!this.data[itemIndex].active) {
      this.subItemsExpanded[itemIndex] = false;
      this.onClickExpandAllSubItem(itemIndex);
    } else {
      this.onClickExpandSubItem(itemIndex, 0);
    }
  }

  onClickExpandSubItem(itemIndex: number, subItemIndex: number) {
    this.data[itemIndex][this.subItemKey][subItemIndex].active = !this.data[itemIndex][this.subItemKey][subItemIndex]
      .active;

    const checkSubItemOpen = this.data[itemIndex][this.subItemKey].filter((subItem: any) => subItem.active)[0];
    if (!checkSubItemOpen) {
      this.subItemsExpanded[itemIndex] = false;
    }
  }

  onClickExpandAllItem(event: any) {
    for (let itemIndex = 0; itemIndex < this.data.length; itemIndex++) {
      this.data[itemIndex].active = event;
    }
    for (let i = 0; i < this.data.length; i++) {
      this.subItemsExpanded[i] = event;
      this.onClickExpandAllSubItem(i);
    }
  }

  onClickExpandAllSubItem(itemIndex: number) {
    for (let j = 0; j < this.data[itemIndex][this.subItemKey].length; j++) {
      this.data[itemIndex][this.subItemKey][j].active = this.subItemsExpanded[itemIndex];
    }
  }
}
