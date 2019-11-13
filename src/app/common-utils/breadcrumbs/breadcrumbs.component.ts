import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from '../../shared/session.service';

interface IBreadcrumb {
  label: string;
  params?: Params;
  url: string;
}
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: IBreadcrumb[];
  public breadcrumbLength: number;
  public checkAdvocate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private sessionService: SessionService
  ) {
    this.breadcrumbs = [];
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
      this.breadcrumbLength = this.breadcrumbs.length;
      //  this.checkAdvocate = this.sessionService.checkAdvocateRole().value;
      iconRegistry.addSvgIcon(
        'chevron_right',
        sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg')
      );
    });
  }

  ngOnInit() {}

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      } else {
        url += '/' + child.parent.snapshot.url.map(segment => segment.path).join('/');
      }
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      url += `/${routeURL}`;
      this.checkAdvocate = url.includes('HealthSystemDetails');
      if (child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'Medical Records Coding Review') {
        breadcrumbs.push({
          label: 'Payment Integrity',
          params: {},
          url: '//GettingReimbursed/GettingReimbursed/PaymentIntegrity'
        });
      }
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      breadcrumbs.push(breadcrumb);
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
