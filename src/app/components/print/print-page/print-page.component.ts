import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
  @select() currentPage;
  selectedPage;
  printStyle = true;
  pagename = '';
  data: any;
  constructor() {
    this.printStyle = true;
    this.data = [
      { page: 'overviewPage', load: 7000 },
      { page: 'gettingReimbursedSummary', load: 7000 },
      { page: 'paymentsPage', load: 5000 },
      { page: 'appealsPage', load: 4000 },
      { page: 'nonPaymentsPage', load: 6000 },
      { page: 'paymentIntegrityPage', load: 3000 },
      { page: 'priorAuthPage', load: 4000 },
      { page: 'pcorPage', load: 4000 },
      { page: 'callsPage', load: 4000 }
    ];
  }

  ngOnInit() {
    this.currentPage.subscribe(c => (this.selectedPage = c));
    setTimeout(
      () => {
        (window as any).print();
      },
      this.data.flatMap(i => (i.page === this.selectedPage ? i.load : 0))
    );
    console.log(
      'laod Time for Print',
      this.data.flatMap(i => (i.page === this.selectedPage ? i.load : 0))
    );
  }
}
