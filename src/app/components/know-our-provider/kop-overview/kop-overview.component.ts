import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventEmitterService } from 'src/app/shared/know-our-provider/event-emitter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kop-overview',
  templateUrl: './kop-overview.component.html',
  styleUrls: ['./kop-overview.component.scss']
})
export class KopOverviewComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(private eventEmitter: EventEmitterService) {}

  ngOnInit() {
    this.eventEmitter.emitEvent(true);
  }

  ngOnDestroy(): void {
    this.eventEmitter.emitEvent(false);
  }
}
