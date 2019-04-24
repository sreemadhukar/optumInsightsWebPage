import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() chartData;
  heightDonut: Number = 234;
  widthDonut: Number = 234;
  heightRotatingArrow: Number = 300;
  widthRotatingArrow: Number = 300;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }
  ngOnInit() {
    console.log('ChartData', this.chartData);
  }
}
