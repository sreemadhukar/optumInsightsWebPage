/*
 * Author: Ranjith kumar Ankam
 * Created Date: 14-May-2019
 *  */
import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mock-data-warning-message',
  templateUrl: './mock-data-warning-message.component.html',
  styleUrls: ['./mock-data-warning-message.component.scss']
})
export class MockDataWarningMessageComponent implements OnInit {
  @Input() data;
  note: any;
  message: any;

  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    console.log(this.data);
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon('warning', sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/warning-icon.svg'));
  }

  ngOnInit() {
    this.note = this.data.note;
    this.message = this.data.message;
  }
}
