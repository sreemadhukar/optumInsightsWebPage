import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';
import { NPSSharedService } from 'src/app/shared/nps/nps.service';
import { KopInsightsService } from 'src/app/shared/know-our-provider/kop-insights.service';

@Component({
  selector: 'app-kop-overview',
  templateUrl: './kop-overview.component.html',
  styleUrls: ['./kop-overview.component.scss']
})
export class KopOverviewComponent implements OnInit, OnDestroy {
  subscription: Subscription;

  // HEADER SECTION
  public pageTitle: string;

  // NPS SECTION
  public npsLoaded: Boolean = false;
  public npsCardOptions: any = {
    npsHeader: true
  };
  public npsSummary: any = {};

  public kopInsightsData: any = {};

  constructor(
    private eventEmitter: EventEmitterService,
    private npsSharedService: NPSSharedService,
    private kopInsightsService: KopInsightsService
  ) {}

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser')) || {};
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';

    this.npsSharedService.getNPSSummary((data: any) => {
      this.npsSummary = data;
      this.npsLoaded = true;
    });
    this.kopInsightsService.getKopInsightsData((data: any) => {
      this.kopInsightsData = data;
    });
  }

  ngOnDestroy(): void {
    this.eventEmitter.emitEvent(false);
  }
}
