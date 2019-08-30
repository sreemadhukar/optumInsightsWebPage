import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  private subject = new Subject<any>();

  constructor() {}

  emitEvent(bool: boolean) {
    this.subject.next({ value: bool });
  }

  getEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
