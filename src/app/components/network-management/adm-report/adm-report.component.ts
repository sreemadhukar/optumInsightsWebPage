import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-adm-report',
  templateUrl: './adm-report.component.html',
  styleUrls: ['./adm-report.component.scss']
})
export class AdmReportComponent implements OnInit {
  @Input() printStyle;
  pageTitle: string;

  constructor(private readonly iconRegistry: MatIconRegistry, private readonly sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'calender',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/calender.svg')
    );
  }

  ngOnInit() {
    this.pageTitle = 'Appropriate Decision Monitoring (ADM)';
  }
}
