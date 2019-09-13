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
  @Input() index;
  @Input() skeleton;
  @Input() options: any;
  subscription: Subscription;
  public printStyle: boolean;
  public TargetActualAvarage: any;
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
    iconRegistry.addSvgIcon(
      'tick',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/round-tick.svg')
    );
  }

  helpIconClick(title) {
    this.glossaryExpandService.setMessage(this.data.title, this.data.MetricID);
  }
  ngOnInit() {
    this.targetactualcard();
  }

  public targetactualcard() {
    setTimeout(() => {
      if (this.data) {
        if (document.getElementById('actual' + this.index)) {
          if (
            (<HTMLElement>document.getElementById('actual' + this.index)).offsetWidth >
            (<HTMLElement>document.getElementById('target' + this.index)).offsetWidth
          ) {
            (<HTMLElement>document.getElementById('actualbardiv')).style.width =
              (<HTMLElement>document.getElementById('target' + this.index)).offsetWidth.toString() + 'px';
          } else {
            (<HTMLElement>document.getElementById('targetbardiv')).style.width =
              (<HTMLElement>document.getElementById('actual' + this.index)).offsetWidth.toString() + 'px';
          }
        }
        if (this.data.type && this.data.type === 'barActualTargetNumbers') {
          this.TargetActualAvarage = ((this.data.data.actual / this.data.data.target) * 100).toFixed(2);
          if (this.TargetActualAvarage <= 100) {
            this.TargetActualAvarage = this.TargetActualAvarage.toString() + '%';
            if (document.getElementById('actual' + this.index)) {
              (<HTMLElement>document.getElementById('actual' + this.index)).style.width = this.TargetActualAvarage;
              (<HTMLElement>document.getElementById('actual' + this.index)).style.backgroundColor = '#00B8CC';
            }
          } else {
            this.TargetActualAvarage = ((this.data.data.target / this.data.data.actual) * 100).toFixed(2);
            this.TargetActualAvarage = this.TargetActualAvarage.toString() + '%';
            if (document.getElementById('actual' + this.index) && document.getElementById('target' + this.index)) {
              (<HTMLElement>document.getElementById('target' + this.index)).style.width = this.TargetActualAvarage;
              (<HTMLElement>document.getElementById('actual' + this.index)).style.backgroundColor = '#E91B18';
            }
          }
        }
      }
    }, 200);
  }
}
