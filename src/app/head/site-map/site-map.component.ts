import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-site-map',
  templateUrl: './site-map.component.html',
  styleUrls: ['./site-map.component.scss']
})
export class SiteMapComponent implements OnInit {
  public navCategories = [
    {
      name: 'Getting Reimbursed',
      children: [
        { name: 'Summary', path: '/GettingReimbursed' },
        { name: 'Payments', path: '/GettingReimbursed/Payments' },
        { name: 'Non-Payments', path: '/GettingReimbursed/NonPayments' },
        { name: 'Appeals', path: '/GettingReimbursed/Appeals' },
        { name: 'Payment Integrity', path: '/GettingReimbursed/PaymentIntegrity' }
      ]
    },
    {
      name: 'Care Delivery',
      children: [
        { name: 'Prior Authorizations', path: '/CareDelivery/priorAuth' },
        { name: 'Patient Care Opportunity', path: '/OverviewPage' }
      ]
    },
    {
      name: 'Service Interaction',
      children: [
        { name: 'Self Service', path: '/ServiceInteraction/SelfService' },
        { name: 'Calls', path: '/ServiceInteraction/Calls' }
      ]
    },
    {
      name: 'About UHC Insights',
      children: [
        { name: 'Privacy', path: '/PrivacyPolicy' },
        { name: 'Terms of Use', path: '/TermsofUse' },
        { name: 'Site Map', path: '/SiteMap' }
      ]
    }
  ];

  constructor() {}

  ngOnInit() {}
}
