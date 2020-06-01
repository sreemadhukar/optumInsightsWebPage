import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

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
  public printStyle;
  public hyperLinkFlag = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private iconRegistry: MatIconRegistry,
    private readonly sanitizer: DomSanitizer
  ) {
    this.breadcrumbs = [];
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const root: ActivatedRoute = this.activatedRoute.root;
      this.breadcrumbs = this.getBreadcrumbs(root);
      if (this.breadcrumbs[0] && this.breadcrumbs[0].label === 'Performance Management Summary') {
        this.hyperLinkFlag = true;
      }
      this.breadcrumbLength = this.breadcrumbs.length;
      this.iconRegistry.addSvgIcon(
        'chevron_right',
        this.sanitizer.bypassSecurityTrustResourceUrl(
          '/src/assets/images/icons/Navigation/baseline-chevron_right-24px.svg'
        )
      );
    });
  }

  ngOnInit() {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
  }

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
      } else if (child.snapshot.data[ROUTE_DATA_BREADCRUMB] === 'Smart Edits') {
        breadcrumbs.push({
          label: 'Payment Integrity',
          params: {},
          url: '//GettingReimbursed/GettingReimbursed/SmartEdits'
        });
      }
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      if (breadcrumb.label !== null) {
        breadcrumbs.push(breadcrumb);
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }
    }
    return breadcrumbs;
  }
}
