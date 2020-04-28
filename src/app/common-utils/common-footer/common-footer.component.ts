import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
    iconRegistry.addSvgIcon(
      'chevron_right',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg')
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

  removeLeadingZero(date) {
    const textDate = this.decodeHtml(date);
    const startDate = textDate.substring(4, 6),
      endDate = textDate.substring(17, 19);
    if (startDate === endDate) {
      const regex = new RegExp(`${startDate}`, 'g');
      return textDate.replace(regex, `${+startDate}`);
    }
    return textDate.replace(startDate, `${+startDate}`).replace(endDate, `${+endDate}`);
  }

  decodeHtml(htmlEntity) {
    const txt = document.createElement('textarea');
    txt.innerHTML = htmlEntity;
    return txt.value;
  }
}
