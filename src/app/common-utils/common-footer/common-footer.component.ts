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
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
      ];
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      let mmlast6 = String(today.getMonth() - 5).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();
      let yyyylast6 = today.getFullYear();
      let ddlast6 = String(today.getDate()).padStart(2, '0');
      if (parseInt(mm) < 6) {
        mmlast6 = String(today.getMonth() + 12 - 5).padStart(2, '0'); // January is 0!
        yyyylast6 = today.getFullYear() - 1;
      }
      if (parseInt(dd) > monthNames[parseInt(mmlast6) + 11]) {
        ddlast6 = monthNames[parseInt(mmlast6) + 11];
      }
      this.timePeriodFooter =
        monthNames[parseInt(mmlast6) - 1] +
        ' ' +
        ddlast6 +
        ',' +
        ' ' +
        yyyylast6 +
        ' - ' +
        monthNames[parseInt(mm) - 1] +
        ' ' +
        dd +
        ',' +
        ' ' +
        yyyy;
    } else {
      this.timePeriodFooter = this.timePeriod;
    }
  }
}
