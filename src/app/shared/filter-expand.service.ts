import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterExpandService {
  public url = new Subject<string>();
  public filterData = new Subject<any>();

  constructor() {}
  setURL(value: string) {
    this.url.next(value);
    // it is publishing this value to all the subscribers that have already subscribed to this message
  }
  setData(value: any) {
    this.filterData.next(value);
  }
}
