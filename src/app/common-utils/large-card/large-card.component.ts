import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-large-card',
  templateUrl: './large-card.component.html',
  styleUrls: ['./large-card.component.scss']
})
export class LargeCardComponent implements OnInit {
  @Input() data;
  @Input() title;
  @Input() timePeriod;
  @Input() skeletonLarge;
  printStyle: boolean;
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private router: Router
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }

  helpIconClick(title) {
    if (this.data[0].MetricID) {
      this.glossaryExpandService.setMessage(title, this.data[0].MetricID);
    } else if (this.data.MetricID) {
      this.glossaryExpandService.setMessage(title, this.data.MetricID);
    }
  }

  ngOnInit() {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }
}
