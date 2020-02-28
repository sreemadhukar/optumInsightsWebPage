import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})
export class LabsComponent implements OnInit {
  public titleForLabs;
  public subTitleForLabs;

  constructor() {}

  ngOnInit() {
    this.titleForLabs = 'Preferred Lab Network Use Rate';
    this.subTitleForLabs = `Here is where our optional page title description text would
                                 live if we needed to use it. You can easily remove this
                                 from the design by hiding it in your symbol overrides.
                                 Please DO NOT detach this symbol.`;
  }
}
