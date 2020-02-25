import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding-verbatims',
  templateUrl: './onboarding-verbatims.component.html',
  styleUrls: ['./onboarding-verbatims.component.scss']
})
export class OnboardingVerbatimsComponent implements OnInit {
  public topics = [
    {
      label: 'Payments',
      value: 'payments'
    },
    {
      label: 'Credentialing',
      value: 'credentialing'
    },
    {
      label: 'Communication',
      value: 'communication'
    },
    {
      label: 'Contract',
      value: 'contract'
    },
    {
      label: 'Unresponsive',
      value: 'unresponsive'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
