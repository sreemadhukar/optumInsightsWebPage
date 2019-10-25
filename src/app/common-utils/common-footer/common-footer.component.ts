import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;
  @Input() title: String;
  @Input() linkName: String;
  @Input() routePath: String;
  timePeriodFooter: String;
  constructor(private router: Router, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'chevron_right',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg')
    );
  }

  ngOnInit() {
    if (this.timePeriod === 'Last 6 Months') {
      const today = new Date();
      let yyyy = today.getFullYear();
      const month = [
        { monthNames: 'Jan', monthlastdate: this.getDaysInMonth(1, yyyy) },
        { monthNames: 'Feb', monthlastdate: this.getDaysInMonth(2, yyyy) },
        { monthNames: 'Mar', monthlastdate: this.getDaysInMonth(3, yyyy) },
        { monthNames: 'Apr', monthlastdate: this.getDaysInMonth(4, yyyy) },
        { monthNames: 'May', monthlastdate: this.getDaysInMonth(5, yyyy) },
        { monthNames: 'Jun', monthlastdate: this.getDaysInMonth(6, yyyy) },
        { monthNames: 'Jul', monthlastdate: this.getDaysInMonth(7, yyyy) },
        { monthNames: 'Aug', monthlastdate: this.getDaysInMonth(8, yyyy) },
        { monthNames: 'Sep', monthlastdate: this.getDaysInMonth(9, yyyy) },
        { monthNames: 'Oct', monthlastdate: this.getDaysInMonth(10, yyyy) },
        { monthNames: 'Nov', monthlastdate: this.getDaysInMonth(11, yyyy) },
        { monthNames: 'Dec', monthlastdate: this.getDaysInMonth(12, yyyy) }
      ];
      let mm = String(today.getMonth()).padStart(2, '0'); // January is 0!
      if (parseInt(mm) === 0) {
        mm = '12';
        yyyy = today.getFullYear() - 1;
      }
      let mmlast6 = String(today.getMonth() - 6).padStart(2, '0'); // January is 0!
      let yyyylast6 = today.getFullYear();
      if (yyyylast6 % 4 === 0) {
        month[1].monthlastdate = 29;
      }
      if (parseInt(mm) < 6) {
        mmlast6 = String(today.getMonth() + 12 - 6).padStart(2, '0'); // January is 0!
        yyyylast6 = today.getFullYear() - 1;
      }
      let dd = String(month[parseInt(mm) - 1].monthlastdate);
      //   let dd = String(today.getDate()).padStart(2, '0');
      // let ddlast6 = String(today.getDate()).padStart(2, '0');
      let ddlast6 = String(month[parseInt(mmlast6) - 1].monthlastdate);
      if (this.title.includes('Prior')) {
        mm = String(today.getMonth() + 1).padStart(2, '0');
        mmlast6 = String(today.getMonth() - 5).padStart(2, '0');
        yyyylast6 = today.getFullYear();
        yyyy = today.getFullYear();
        if (parseInt(mm) < 7) {
          mmlast6 = String(today.getMonth() + 12 - 5).padStart(2, '0');
          yyyylast6 = today.getFullYear() - 1;
        }
        dd = String(today.getDate() - 1).padStart(2, '0');
        ddlast6 = String(today.getDate() - 1).padStart(2, '0');
        if (parseInt(dd) > month[parseInt(mmlast6) - 1].monthlastdate) {
          ddlast6 = String(month[parseInt(mmlast6) - 1].monthlastdate);
        }
      }

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
  linkFunction() {
    this.router.navigate([this.routePath]);
  }
  getDaysInMonth(month, year) {
    // Here January is 1 based
    // Day 0 is the last day in the previous month
    return new Date(year, month, 0).getDate();
    // Here January is 0 based
    // return new Date(year, month+1, 0).getDate();
  }
}
