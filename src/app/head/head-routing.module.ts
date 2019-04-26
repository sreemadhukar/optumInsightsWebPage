import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: 'OverviewPage',
    loadChildren: '../components/overview-page/overview-page.module#OverviewPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'GettingReimbursed',
    loadChildren: '../components/getting-reimbursed-page/getting-reimbursed.module#GettingReimbursedModule',
    data: {
      breadcrumb: 'Getting Reimbursed'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'CareDelivery',
    loadChildren: '../components/care-delivery-page/care-delivery-page.module#CareDeliveryPageModule',
    data: {
      breadcrumb: 'Care Delivery'
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'ProviderSearch',
    loadChildren: '../components/provider-search/provider-search.module#ProviderSearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'issueResolution',
    loadChildren: '../components/issue-resolution-page/issue-resolution-page.module#IssueResolutionPageModule',
    data: {
      breadcrumb: 'Issue Resolution'
    },
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class HeadRoutingModule {}
