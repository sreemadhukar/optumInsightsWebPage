import { Component, OnInit, OnDestroy } from '@angular/core';
import { AcoEventEmitterService } from '../../../shared/ACO/aco-event-emitter.service';
import { SessionService } from '../../../shared/session.service';

@Component({
  selector: 'app-aco-page',
  templateUrl: './aco-page.component.html',
  styleUrls: ['./aco-page.component.scss']
})
export class AcoPageComponent implements OnInit, OnDestroy {
  loading = true;
  public pageTitle: any;
  public pageSubTitle = 'Your ACO Insights at a glance.';
  constructor(private session: SessionService, private acoEventEmitter: AcoEventEmitterService) {
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
  }

  ngOnInit() {
    this.acoEventEmitter.emitEvent(true);
  }
  ngOnDestroy(): void {
    this.acoEventEmitter.emitEvent(false);
  }
}
