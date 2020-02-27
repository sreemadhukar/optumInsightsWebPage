import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss'],
  animations: [
    // Each unique animation requires its own trigger. The first argument of the trigger function is the name
    trigger('rotatedState', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate(180deg)' })),
      transition('rotated => default', animate('180ms ease-out')),
      transition('default => rotated', animate('180ms ease-in'))
    ])
  ]
})
export class ContactusComponent implements OnInit {
  section: any = [];
  barChartsArray = [
    {
      question: 'What is UHC Insights?',
      answer: `UnitedHealthcare Insights (UHC Insights) centralizes provider reporting in a way that creates
         transparency, personalization and drives action. UHC Insights will be available to care providers
          via a tile on Link, utilizing their Optum ID to log in.  Functionality in 2020 will include near real-time
           data in the following areas:`,
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
      answer: `The interface is designed to help care providers proactively manage engagement with UnitedHealthcare.
          UHC Insights will provide the ability to have a common platform to discuss operational and clinical
           improvement opportunities with UnitedHealthcare representatives.  Sharing actionable data and meaningful
            metrics that will allow care providers to work with UnitedHealthcare teams to focus on the most impactful ways
             to simplify the provider experience and monitor their performance.`
    },
    {
      question:
        'How can I filter the data to get more specific? Can I see reporting down to an individual Tax ID (TIN)?',
      answer: `UHC Insights has a Filter menu on many pages that can help you narrow down data by Time Period,
         Line of Business, Tax ID (TIN) and several other options.`
    }
    // {
    //   question: 'What if I have an idea for UHC Insights?',
    //   answer:
    //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
    // }
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
