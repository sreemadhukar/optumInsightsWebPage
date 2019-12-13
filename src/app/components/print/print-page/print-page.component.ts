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

  constructor() {
    this.printStyle = true;
  }

  ngOnInit() {
    this.currentPage.subscribe(currentPage => (this.selectedPage = currentPage));
    setTimeout(() => {
      (window as any).print();
    }, 7000);
  }
}
