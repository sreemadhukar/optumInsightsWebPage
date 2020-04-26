import { Component, OnInit, Input } from '@angular/core';
import { IAdvTinDetailsResponse } from '../../user.class';
@Component({
  selector: 'app-impact-card',
  templateUrl: './impact-card.component.html',
  styleUrls: ['./impact-card.component.scss']
})
export class ImpactCardComponent implements OnInit {
  @Input() data: IAdvTinDetailsResponse;
  constructor() {}

  ngOnInit() {
    console.log('Impact Card', this.data);
  }
}
