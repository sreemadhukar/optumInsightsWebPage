import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-adm-report',
  templateUrl: './adm-report.component.html',
  styleUrls: ['./adm-report.component.scss']
})
export class AdmReportComponent implements OnInit {
  @Input() printStyle;
  pageTitle: String = '';

  LOBData = ['Commercial', 'Medicare', 'Medicaid'];
  constructor() {}

  ngOnInit() {
    this.pageTitle = 'Appropriate Decision Monitoring (ADM)';
  }

  getLOBValue(data) {
    alert('selected --->' + data);
  }
}
