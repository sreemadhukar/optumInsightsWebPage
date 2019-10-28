import { Component, OnInit, OnDestroy } from '@angular/core';
import { AcoEventEmitterService } from '../../../shared/ACO/aco-event-emitter.service';
import { SessionService } from '../../../shared/session.service';
import { AcoSharedService } from '../../../shared/ACO/aco-shared.service';
import { environment } from '../../../../environments/environment';

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
  public contractSPeriod: Date;
  public contractEPeriod: Date;
  public quater: string;
  public pageSubTitle = 'Your ACO Insights at a glance.';
  isInternal: boolean = environment.internalAccess;
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
      this.contractSPeriod = data[2];
      this.contractEPeriod = data[3];
      this.quater = data[4];
    });
  }
  ngOnDestroy(): void {
    this.acoEventEmitter.emitEvent(false);
  }
}
