import { Component, OnInit } from '@angular/core';
import { GlossaryExpandService } from 'src/app/shared/glossary-expand.service';
import { StorageService } from '../../../shared/storage-service.service';

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
  subscription: any;
  piDonutData = {
    timeperiod: 'Last 6 Months',
    donutData: {
      centerNumber: '1.1K',
      color: ['#3381FF', '#D7DCE1'],
      gdata: ['card-inner', 'piCard'],
      graphValues: [100, 1000],
      sdata: { sign: 'down', data: '-1.2%' }
    },
    besideData: {
      color: ['#3381FF', '#D7DCE1'],
      labels: ['Pre-Payment Records Requested', 'Claims Submitted']
    }
  };
  constructor(private glossaryExpandService: GlossaryExpandService, private checkStorage: StorageService) {
    this.pageTitle = 'Claims Payment Integrity';
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {}
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
}
