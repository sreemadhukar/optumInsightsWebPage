import { Component, OnInit, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { GlossaryExpandService } from '../../shared/glossary-expand.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-heac-small-card',
  templateUrl: './heac-small-card.component.html',
  styleUrls: ['./heac-small-card.component.scss']
})
export class HeacSmallCardComponent implements OnInit {
  @Input() data;
  @Input() skeleton;
  subscription: Subscription;
  public printStyle: boolean;
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
    private sanitizer: DomSanitizer,
    private glossaryExpandService: GlossaryExpandService,
    private router: Router
  ) {
    if (this.router.url.includes('print-')) {
      this.printStyle = true;
    }
    /** INITIALIZING SVG ICONS TO USE IN DESIGN - ANGULAR MATERIAL */
    this.iconRegistry.addSvgIcon(
      'help',
      this.sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Action/baseline-help_outline-24px.svg')
    );
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(title, this.data.MetricID);
  }
  ngOnInit() {}
}
