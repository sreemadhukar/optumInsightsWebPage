import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-footer-common',
  templateUrl: './footer-common.component.html',
  styleUrls: ['./footer-common.component.scss']
})
export class FooterCommonComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  footerClicked(name: string) {
    if (name === 'privacy') {
      this.router.navigateByUrl('/PrivacyPolicy');
    } else if (name === 'terms') {
      this.router.navigateByUrl('/TermsofUse');
    } else if (name === 'sitemap') {
      this.router.navigateByUrl('/SiteMap');
    }
  }
}
