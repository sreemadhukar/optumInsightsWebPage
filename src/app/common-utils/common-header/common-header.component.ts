import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';

@Component({
  selector: 'app-common-header',
  templateUrl: './common-header.component.html',
  styleUrls: ['./common-header.component.scss']
})
export class CommonHeaderComponent implements OnInit {
  @Input() title: String;
  @Output() helpIconClicked = new EventEmitter();
  @Input() cardType: String;
  titleHeader: String = null;
  typeOfCard: String = null;
  constructor(private glossaryExpandService: GlossaryExpandService) {}

  ngOnInit() {
    this.titleHeader = this.title;
    this.typeOfCard = this.cardType;
  }
  helpFunctionClicked() {
    this.helpIconClicked.emit(this.title);
    this.glossaryExpandService.glossaryFlag = true;
    this.glossaryExpandService.glossaryTitle = this.title;
  }
}
