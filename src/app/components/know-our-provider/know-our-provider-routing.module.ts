import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KopOverviewComponent } from './kop-overview/kop-overview.component';
import { KopNpsComponent } from './kop-nps/kop-nps.component';
import { KopOnboardingComponent } from './kop-onboarding/kop-onboarding.component';
import { OnboardingContractingComponent } from './onboarding-contracting/onboarding-contracting.component';
import { OnboardingVerbatimsComponent } from './onboarding-verbatims/onboarding-verbatims.component';
import { OnboardinCredentialingComponent } from './onboardin-credentialing/onboardin-credentialing.component';
import { OnboardinSummaryLandingComponent } from './onboardin-summary-landing/onboardin-summary-landing.component';

const routes: Routes = [
  { path: '', component: KopOverviewComponent },
  {
    path: 'NpsDetail',
    component: KopNpsComponent
  },
  {
    path: 'Onboarding',
    component: KopOnboardingComponent,
    children: [
      {
        path: 'Summary',
        component: OnboardinSummaryLandingComponent
      },
      {
        path: 'Summary/credentailing',
        component: OnboardinCredentialingComponent
      },
      {
        path: 'Summary/contracting',
        component: OnboardingContractingComponent
      },
      {
        path: 'Summary/verbatims',
        component: OnboardingVerbatimsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KnowOurProviderRoutingModule {}
