import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent {
  @Input() timePeriod: String;
  @Input() title: String;
  @Input() linkName: String;
  @Input() routePath: String;
  @Input() handleCaseForOverviewTile = false;
  routhTo: string;
  public get timePeriodFooter() {
    if (!this.timePeriod) {
      return '';
    }
    this.timePeriod = this.timePeriod.replace(' - ', '&ndash;');
    return this.timePeriod;
  }
  constructor(private router: Router, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.iconRegistry.addSvgIcon(
      'chevron_right',
      this.sanitizer.bypassSecurityTrustResourceUrl(
        '/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg'
      )
    );
  }

  linkFunction() {
    if (this.linkName === 'Calls Overview') {
      this.routhTo = '/ServiceInteraction/Calls';
    } else if (this.linkName === 'Non-Payment Details') {
      this.routhTo = '/GettingReimbursed/NonPayments';
    } else if (this.linkName === 'Appeals Overview') {
      this.routhTo = '/GettingReimbursed/Appeals';
    } else if (this.linkName === 'View Details') {
      if (this.title === 'Preferred Specialist Referral Rate') {
        this.routhTo = '/Performance/Referrals';
      } else if (this.title === 'Preferred Lab Network Use Rate') {
        this.routhTo = '/Performance/Labs';
      } else if (this.title === 'Preferred Tier Prescribing Rate') {
        this.routhTo = '/Performance/Prescriptions';
      }
    }
    this.router.navigate([this.routhTo]);
  }

  removeLeadingZero(text) {
    const textData = this.decodeHtml(text);
    const months = this.getMonths(textData);
    if (months.m1 && !months.m2) {
      const date = textData.substr(textData.indexOf(months.m1) + 4, 2);
      return textData.replace(date, `${+date}`);
    } else if (months.m1 && months.m2 && months.m1 === months.m2) {
      const startDate = textData.substr(textData.indexOf(months.m1) + 4, 2);
      const endDate = textData.substr(textData.lastIndexOf(months.m1) + 4, 2);
      return this.replaceTwoDigitToOne(startDate, endDate, textData);
    } else if (months.m1 && months.m2) {
      const startDate = textData.substr(textData.indexOf(months.m1) + 4, 2);
      const endDate = textData.substr(textData.indexOf(months.m2) + 4, 2);
      return this.replaceTwoDigitToOne(startDate, endDate, textData);
    } else {
      return textData;
    }
  }

  replaceTwoDigitToOne(startDate, endDate, textData) {
    if (startDate === endDate) {
      const regex = new RegExp(`${startDate}`, 'g');
      return textData.replace(regex, `${+startDate}`);
    }
    return textData.replace(startDate, `${+startDate}`).replace(endDate, `${+endDate}`);
  }

  decodeHtml(htmlEntity) {
    const txt = document.createElement('textarea');
    txt.innerHTML = htmlEntity;
    return txt.value;
  }

  getMonths(str) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    let m1, m2;
    for (let i = 0; i < months.length; i++) {
      if (str.indexOf(months[i]) !== -1) {
        m1 = months[i];
        if (str.lastIndexOf(months[i]) === str.indexOf(months[i])) {
          const lessMonth = [...months];
          _.pull(lessMonth, months[i]);
          m2 = lessMonth.filter(item => str.indexOf(item) !== -1)[0];
          break;
        } else {
          m2 = m1;
          break;
        }
      }
    }
    return { m1: m1, m2: m2 };
  }
}
