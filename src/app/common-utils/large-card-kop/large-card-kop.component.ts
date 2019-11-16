import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
@Component({
  selector: 'app-large-card-kop',
  templateUrl: './large-card-kop.component.html',
  styleUrls: ['./large-card-kop.component.scss']
})
export class LargeCardKopComponent implements OnInit {
  @Input() data;
  @Input() title;
  @Input() timePeriod;
  @Input() skeletonLarge;
  showMetricProgressIcon = false;

  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService
  ) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
    iconRegistry.addSvgIcon(
      'insert-chart',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-insert_chart-24px.svg')
    );
  }

  helpIconClick(title) {
    if (this.data) {
      this.glossaryExpandService.setMessage(this.data.title, this.data.MetricID);
    }
  }

  ngOnInit() {
    this.showMetricDevelopment();
  }

  // Temporary - To be removed once metric development is completed
  showMetricDevelopment() {
    if (this.data.title === 'Engagement') {
      for (const item of this.data.chartData) {
        item.showMetricProgressIcon = true;
      }
    }
    if (this.data.title === 'Issue Resolution' || this.data.title === 'Onboarding') {
      for (const item of this.data.chartData) {
        if (item.cardType === 'horizontalBar' || item.cardType === 'verticalBar') {
          item.showMetricProgressIcon = true;
        } else {
          item.showMetricProgressIcon = false;
        }
      }
    }
  }
}
