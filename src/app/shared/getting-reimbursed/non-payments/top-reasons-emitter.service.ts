import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TopReasonsEmitterService {
  public message = new Subject<any>();
  constructor() {}
  sendReasonsDetails(data: any, rsnSelected: string, subReason: string) {
    this.message.next({ fullData: data, reasonSelected: rsnSelected, subReason: subReason });
    // it is publishing this value to all the subscribers that have already subscribed to this message
  }
}
