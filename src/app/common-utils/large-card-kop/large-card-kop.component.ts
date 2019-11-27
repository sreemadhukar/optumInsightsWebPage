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

  public get cardData() {
    return this.data;
  }

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

  ngOnInit() {}
}
