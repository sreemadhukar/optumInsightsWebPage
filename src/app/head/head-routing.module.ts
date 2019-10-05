import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';
import { TermsOfUseComponent } from './terms-of-use/terms-of-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SiteMapComponent } from './site-map/site-map.component';
import { CustomPreloadingStrategy } from './custom-preloading';

const routes: Routes = [
  {
    path: '',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: 'login',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: 'OverviewPageAdvocate',
    loadChildren: '../components/advocate/advocate.module#AdvocateModule',
    canActivate: [AuthGuard]
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
      breadcrumb: 'Getting Reimbursed',
      preload: true,
      delay: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'CareDelivery',
    loadChildren: '../components/care-delivery-page/care-delivery-page.module#CareDeliveryPageModule',
    data: {
      breadcrumb: 'Care Delivery',
      preload: true,
      delay: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'ProviderSearch',
    loadChildren: '../components/provider-search/provider-search.module#ProviderSearchModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ServiceInteraction',
    loadChildren: '../components/service-interaction/service-interaction.module#ServiceInteractionModule',
    data: {
      breadcrumb: 'Service Interaction',
      preload: true,
      delay: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'AcoPage',
    loadChildren: '../components/ACO/aco.module#AcoModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'KnowOurProvider',
    loadChildren: '../components/know-our-provider/know-our-provider.module#KnowOurProviderModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'AdminSummaryTrends',
    loadChildren: '../components/summary-trends/summary-trends.module#SummaryTrendsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'TermsofUse',
    component: TermsOfUseComponent
  },
  {
    path: 'PrivacyPolicy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'SiteMap',
    component: SiteMapComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled' // Add options right here , to scroll to top whenever navigaion is changed
    })
  ],
  exports: [RouterModule]
})
export class HeadRoutingModule {}
