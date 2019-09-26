import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;

  timePeriodFooter: String = null;

  constructor() {}

  ngOnInit() {
    if (this.timePeriod === 'Last 6 Months') {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      let mmlast6 = String(today.getMonth() - 5).padStart(2, '0'); // January is 0!
      let yyyy = today.getFullYear();
      if (parseInt(mm) < 6) {
        mmlast6 = String(today.getMonth() + 12 - 5).padStart(2, '0'); // January is 0!
        yyyy = today.getFullYear() - 1;
      }
      this.timePeriodFooter = mm + '/' + dd + '/' + yyyy + ' - ' + mmlast6 + '/' + dd + '/' + yyyy;
    } else {
      this.timePeriodFooter = this.timePeriod;
    }
  }
}
