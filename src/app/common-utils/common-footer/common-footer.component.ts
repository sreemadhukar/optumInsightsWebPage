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
  @Input() linkName: String;
  @Input() routePath: String;

  constructor(private router: Router, private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'chevron_right',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg')
    );
  }

  ngOnInit() {}

  linkFunction() {
    this.router.navigate([this.routePath]);
  }
}
