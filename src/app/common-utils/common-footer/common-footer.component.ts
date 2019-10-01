import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss']
})
export class CommonFooterComponent implements OnInit {
  @Input() timePeriod: String;
  @Input() linkName: String;
  @Input() routePath: String;

  constructor(private router: Router) {}

  ngOnInit() {}

  linkFunction() {
    this.router.navigate([this.routePath]);
  }
}
