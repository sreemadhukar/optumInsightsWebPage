import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  section: any = [];
  barChartsArray = [
    {
      question: 'What is UHC Insights?',
      answer:
        'UnitedHealthcare Insights (UHC Insights) centralizes provider reporting in a way that creates transparency, personalization and drives action. UHC Insights will be available to care providers via a tile on Link, utilizing their Optum ID to log in.  Functionality in 2020 will include near real-time data in the following areas:',
      list: [
        'Prior Authorization',
        'Claims ',
        'Service Interaction: Calls by call type',
        'Self-Service metrics leading toward identifying opportunities to improve overall operational efficiency'
      ]
    },
    {
      question: 'How frequently is data refreshed?',
      answer: 'Reporting will be personalized, integrated, and interactive with near real-time data refreshed daily.'
    },
    {
      question: 'How does this benefit the UnitedHealthcare Provider Network?',
      answer:
        'The interface is designed to help care providers proactively manage engagement with UnitedHealthcare.  UHC Insights will provide the ability to have a common platform to discuss operational and clinical improvement opportunities with UnitedHealthcare representatives.  Sharing actionable data and meaningful metrics that will allow care providers to work with UnitedHealthcare teams to focus on the most impactful ways to simplify the provider experience and monitor their performance.'
    },
    {
      question:
        'How can I filter the data to get more specific? Can I see reporting down to an individual Tax ID (TIN)?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
    },
    {
      question: 'What if I have an idea for UHC Insights?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur'
    }
  ];
  content = {
    title: 'Contact Us',
    text:
      "We're here to help! Please reach out to your UnitedHealthcare contact with any questions or locate your state's contact information."
  };
  constructor(private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'carrot',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/keyboard_arrow_down-24px.svg')
    );
  }

  ngOnInit() {}

  reasonsCollapose(x: Number) {
    for (let i = 0; i < this.section.length; i++) {
      if (i !== x) {
        this.section[i] = false;
      }
    }
  }
}
