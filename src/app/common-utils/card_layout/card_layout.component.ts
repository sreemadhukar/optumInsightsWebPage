import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';

@Component({
  selector: 'app-card-layout',
  templateUrl: './card_layout.component.html',
  styleUrls: ['./card_layout.component.scss']
})
export class CardLayoutComponent implements OnInit {
  @Input() data: any;
  constructor(private glossaryExpandService: GlossaryExpandService) {}

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.data.MetricID);
  }
  ngOnInit() {}
}
