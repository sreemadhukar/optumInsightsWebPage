import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-impact-card',
  templateUrl: './impact-card.component.html',
  styleUrls: ['./impact-card.component.scss']
})
export class ImpactCardComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit() {}
}
