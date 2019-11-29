import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {
  printStyle = true;
  pagename = '';

  constructor(private route: ActivatedRoute) {
    this.printStyle = true;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pagename = params['pageName'];
      console.log('Page print', this.pagename);
      setTimeout(() => {
        (window as any).print();
      }, 8000);
      console.log('Page print', this.pagename);
    });
  }
}
