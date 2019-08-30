import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';
import { NPSSharedService } from 'src/app/shared/nps/nps.service';

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
    titleFontFamily: 'UHC Sans',
    titleFontWeight: '600',
    titleColor: '#2D2D39'
  };
  public npsSummary: any;

  constructor(private eventEmitter: EventEmitterService, private npsSharedService: NPSSharedService) {}

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
    const userInfo = JSON.parse(sessionStorage.getItem('loggedUser'));
    this.pageTitle = 'Hello, ' + userInfo.FirstName + '.';

    this.npsSharedService.getNPSSummary((data: any) => {
      this.npsSummary = data;
      this.npsLoaded = true;
    });
  }

  ngOnDestroy(): void {
    this.eventEmitter.emitEvent(false);
  }
}
