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
        this._location.back();
        clearInterval(id);
      }
    }, 1000);
  }
}
