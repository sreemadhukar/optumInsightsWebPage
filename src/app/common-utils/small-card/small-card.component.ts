import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss']
})
export class SmallCardComponent implements OnInit {
  @Input() data;
  @Input() skeleton;
  @Input() options: any;
  subscription: Subscription;
  public printStyle: boolean;
  public besideData: any;
  /*
  _card: Object = {};
  data: Object = {};
  get card(): Object {
    return this._card;
  }

  @Input('card')
  set card(value: Object) {
    this._card = value;
    this.data = value;
  }
*/
  constructor(
    private iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private router: Router
  ) {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    iconRegistry.addSvgIcon(
      'help',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(this.data.title, this.data.MetricID);
  }
  ngOnInit() {
    this.besideData = this.data.besideData;
  }
}
