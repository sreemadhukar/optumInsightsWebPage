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
  @Input() handleCaseForOverviewTile = false;
  routhTo: string;
  constructor(private router: Router, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'chevron_right',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg')
    );
  }

  linkFunction() {
    if (this.linkName === 'Calls Overview') {
      this.routhTo = '/ServiceInteraction/Calls';
    } else if (this.linkName === 'Calls Overview') {
      this.routhTo = '/GettingReimbursed/NonPayments';
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
}
