import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() chartData;
  @Input() skeleton;
  heightDonut: Number = 234;
  widthDonut: Number = 234;
  heightRotatingArrow: Number = 212;
  widthRotatingArrow: Number = 225;
  heightSmallBarChart: Number = 155;
  widthSmallBarChart: Number = 268;
  customSmallBarChart: Boolean = false;
  constructor(private glossaryExpandService: GlossaryExpandService) {}

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title);
  }
  ngOnInit() {}
}
