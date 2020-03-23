import { Component, OnInit, Input } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';

@Component({
  selector: 'app-rlp-long-card',
  templateUrl: './rlp-long-card.component.html',
  styleUrls: ['./rlp-long-card.component.scss']
})
export class RlpLongCardComponent implements OnInit {
  @Input() config;
  @Input() skeletonLong;
  constructor(private glossaryExpandService: GlossaryExpandService) {}

  ngOnInit() {}
  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.config.MetricID);
  }
}
