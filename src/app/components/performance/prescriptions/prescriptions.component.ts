import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prescriptions',
  templateUrl: './prescriptions.component.html',
  styleUrls: ['./prescriptions.component.scss']
})
export class PrescriptionsComponent implements OnInit {
  public titleForPrescriptions;
  public subTitleForPrescriptions;

  constructor() {}

  ngOnInit() {
    this.titleForPrescriptions = 'Preferred Tier Prescribing Rate';
    this.subTitleForPrescriptions = `Here is where our optional page title description text would
                                 live if we needed to use it. You can easily remove this
                                 from the design by hiding it in your symbol overrides.
                                 Please DO NOT detach this symbol.`;
  }
}
