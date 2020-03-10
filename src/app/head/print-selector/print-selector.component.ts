import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-selector',
  templateUrl: './print-selector.component.html',
  styleUrls: ['./print-selector.component.scss']
})
export class PrintSelectorComponent implements OnInit {
  options = [
    { name: 'overviewPage', checked: false },
    { name: 'gettingReimbursedSummary', checked: false },
    { name: 'paymentsPage', checked: false },
    { name: 'appealsPage', checked: false },
    { name: 'nonPaymentsPage', checked: false },
    { name: 'priorAuthPage', checked: false },
    { name: 'paymentIntegrityPage', checked: false },
    { name: 'pcorPage', checked: false },
    { name: 'callsPage', checked: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  previewPrint() {
    console.log(this.options);
    this.router.navigate(['print-page']);
  }
}
