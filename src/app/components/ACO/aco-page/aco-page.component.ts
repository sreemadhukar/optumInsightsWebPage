import { Component, OnInit, OnDestroy } from '@angular/core';
import { AcoEventEmitterService } from '../../../shared/ACO/aco-event-emitter.service';
import { SessionService } from '../../../shared/session.service';
import { AcoSharedService } from '../../../shared/ACO/aco-shared.service';
@Component({
  selector: 'app-aco-page',
  templateUrl: './aco-page.component.html',
  styleUrls: ['./aco-page.component.scss']
})
export class AcoPageComponent implements OnInit, OnDestroy {
  public acoPageKeyPerformanceData: object;
  loading = true;
  public acoPageData: Array<object>;
  public pageTitle: any;
  public pageSubTitle = 'Your ACO Insights at a glance.';
  constructor(
    private session: SessionService,
    private acoEventEmitter: AcoEventEmitterService,
    private acoSharedService: AcoSharedService
  ) {
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';
  }

  ngOnInit() {
    this.acoEventEmitter.emitEvent(true);
    this.acoSharedService.acoData().then(data => {
      this.acoPageKeyPerformanceData = data[1];
      this.acoPageData = JSON.parse(JSON.stringify(data[0]));
    });
  }
  ngOnDestroy(): void {
    this.acoEventEmitter.emitEvent(false);
  }
}
