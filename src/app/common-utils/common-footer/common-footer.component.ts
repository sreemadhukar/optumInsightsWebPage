import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;
  @Input() title: String;

  timePeriodFooter: String = null;

  constructor() {}

  ngOnInit() {
    if (this.timePeriod === 'Last 6 Months') {
      const month = [
        { monthNames: 'Jan', monthlastdate: 31 },
        { monthNames: 'Feb', monthlastdate: 28 },
        { monthNames: 'Mar', monthlastdate: 31 },
        { monthNames: 'Apr', monthlastdate: 30 },
        { monthNames: 'May', monthlastdate: 31 },
        { monthNames: 'Jun', monthlastdate: 30 },
        { monthNames: 'Jul', monthlastdate: 31 },
        { monthNames: 'Aug', monthlastdate: 31 },
        { monthNames: 'Sep', monthlastdate: 30 },
        { monthNames: 'Oct', monthlastdate: 31 },
        { monthNames: 'Nov', monthlastdate: 30 },
        { monthNames: 'Dec', monthlastdate: 31 }
      ];
      const today = new Date();
      let mm = String(today.getMonth()).padStart(2, '0'); // January is 0!
      if (parseInt(mm) === 0) {
        mm = '12';
      }
      let mmlast6 = String(today.getMonth() - 6).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();
      let yyyylast6 = today.getFullYear();
      if (yyyylast6 % 4 === 0) {
        month[1].monthlastdate = 29;
      }
      if (parseInt(mm) < 6) {
        mmlast6 = String(today.getMonth() + 12 - 6).padStart(2, '0'); // January is 0!
        yyyylast6 = today.getFullYear() - 1;
      }
      const dd = String(month[parseInt(mm) - 1].monthlastdate);
      //   let dd = String(today.getDate()).padStart(2, '0');
      // let ddlast6 = String(today.getDate()).padStart(2, '0');
      const ddlast6 = String(month[parseInt(mmlast6) - 1].monthlastdate);
      if (this.title.includes('Prior')) {
        console.log('madhukar');
      }
      // if (parseInt(dd) > month[parseInt(mmlast6) - 1].monthlastdate) {
      //   ddlast6 = String(month[parseInt(mmlast6) - 1].monthlastdate);
      // }
      this.timePeriodFooter =
        month[parseInt(mmlast6) - 1].monthNames +
        ' ' +
        ddlast6 +
        ',' +
        ' ' +
        yyyylast6 +
        ' - ' +
        month[parseInt(mm) - 1].monthNames +
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
