import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent implements OnInit {
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */

    iconRegistry.addSvgIcon(
      'print-icon',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/print-icon.svg')
    );
  }
  ngOnInit() {}
}
