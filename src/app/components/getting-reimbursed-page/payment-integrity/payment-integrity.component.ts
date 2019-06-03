import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/storage-service.service';

@Component({
  selector: 'app-payment-integrity',
  templateUrl: './payment-integrity.component.html',
  styleUrls: ['./payment-integrity.component.scss']
})
export class PaymentIntegrityComponent implements OnInit {
  subscription: any;
  constructor(private checkStorage: StorageService) {
    this.subscription = this.checkStorage.getNavChangeEmitter().subscribe(() => this.ngOnInit());
  }

  ngOnInit() {}
}
