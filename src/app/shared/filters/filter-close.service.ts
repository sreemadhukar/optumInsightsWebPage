import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterCloseService {
  public filterClose = new Subject<boolean>();
  setfilterClose(value: boolean) {
    this.filterClose.next(value); // it is publishing this value to all the subscribers that have already subscribed to this message
  }
}
