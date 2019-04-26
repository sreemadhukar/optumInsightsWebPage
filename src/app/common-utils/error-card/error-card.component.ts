import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-error-card',
  templateUrl: './error-card.component.html',
  styleUrls: ['./error-card.component.scss']
})
export class ErrorCardComponent implements OnInit {
  public errorCodes = [
    { code: 501, title: 'Data Could Not Be Retrieved', message: 'Sorry. Please try again later' },
    { code: 503, message: '' },
    { code: 500, message: '' },
    { code: 404, title: 'Data Not Available', message: 'Sorry. Please change your filter settings' },
    { code: 403, message: '' }
  ];
  @Input() data;
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }
  ngOnInit() {
    console.log(this.data);
  }
}
