import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  pageTitle: String = '';
  currentTabTitle: String = '';
  timePeriod = 'Last 6 months';
  title = 'Payment Integrity: Medical Record Coding Reveiw';

  donutData = {
    centerNumber: 6795,
    color: ['#3381FF', '#80B0FF', '#003DA1'],
    gdata: ['card-inner', 'piCard'],
    graphValues: [6334, 255, 206],
    sdata: { sign: 'up', data: '+4%' }
  };
  constructor(private glossaryExpandService: GlossaryExpandService) {
    this.pageTitle = 'Claims Payment Integrity';
  }

  ngOnInit() {}
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
