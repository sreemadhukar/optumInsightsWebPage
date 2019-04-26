import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryExpandService {
  public glossaryFlag: Boolean = true;
  public glossaryTitle;
  public message = new Subject<string>();

  constructor() {}
  setMessage(value: string) {
    this.message.next(value);
    console.log('value', value);
    // it is publishing this value to all the subscribers that have already subscribed to this message
  }
}
