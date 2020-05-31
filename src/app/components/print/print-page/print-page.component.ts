import { Component, OnInit } from '@angular/core';
import { select } from '@angular-redux/store';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
  @select(['uhc', 'currentPage']) currentPage;
  selectedPage;
  printStyle = true;
  pagename = '';
  data: any;
  constructor(private _location: Location, private _router: Router) {
    this.printStyle = true;
    // this.data = [
    //   { page: 'overviewPage', load: 7000 },
    //   { page: 'gettingReimbursedSummary', load: 7000 },
    //   { page: 'paymentsPage', load: 6000 },
    //   { page: 'appealsPage', load: 6000 },
    //   { page: 'nonPaymentsPage', load: 6000 },
    //   { page: 'paymentIntegrityPage', load: 5000 },
    //   { page: 'priorAuthPage', load: 10000 },
    //   { page: 'pcorPage', load: 6000 },
    //   { page: 'callsPage', load: 4000 },
    //   { page: 'selfServicePage', load: 4000 }
    // ];
  }

  ngOnInit() {
    this.currentPage.subscribe(c => (this.selectedPage = c));

    setTimeout(() => {
      (window as any).print();
    }, 7000);

    setTimeout(this.navigateToLastPage.bind(this), 10000);
  }

  navigateToLastPage() {
    const id = setInterval(() => {
      console.log(window.matchMedia('print'));
      if (this._router.url === '/print-page') {
        console.log('I am In');
        this._location.back();
        clearInterval(id);
      }
    }, 1000);
  }
}
