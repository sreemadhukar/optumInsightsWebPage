import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.breadcrumbs = [];
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      const root: ActivatedRoute = this.activatedRoute.root;
      // console.log(root);
      this.breadcrumbs = this.getBreadcrumbs(root);
      this.breadcrumbLength = this.breadcrumbs.length;
      console.log(this.breadcrumbLength);
      /*this.breadcrumbs.forEach(element => {
        console.log(element.label);
      });*/
    });
  }

  ngOnInit() {}

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    const children: ActivatedRoute[] = route.children;
    // console.log(ROUTE_DATA_BREADCRUMB, ActivatedRoute, children.length, breadcrumbs);

    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      // alert(child.parent.snapshot.url.map(segment => segment.path).join('/'));
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
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };
      // console.log(breadcrumb.label, breadcrumb.url);
      breadcrumbs.push(breadcrumb);
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
