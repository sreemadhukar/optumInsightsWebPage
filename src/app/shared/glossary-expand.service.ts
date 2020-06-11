import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryExpandService {
  public message = new Subject<any>();

  constructor() {}
  setMessage(value: string, MetricID: string) {
    this.message.next({ value: value, MetricID: MetricID });
    // it is publishing this value to all the subscribers that have already subscribed to this message
  }
}
