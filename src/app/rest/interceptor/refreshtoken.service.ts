import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshtokenService {
  public processing = false;
  public storage = new Subject<any>();
  constructor() {}
  public publish(value: any) {
    this.storage.next(value);
  }
}
