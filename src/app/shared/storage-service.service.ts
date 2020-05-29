import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnDestroy {
  providerChange: EventEmitter<any> = new EventEmitter();
  private onSubject = new Subject<{ key: string; value: any }>();
  private subject = new Subject<any>();

  constructor() {}

  ngOnDestroy() {}

  public store(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
    this.onSubject.next({ key: key, value: data });
    this.emitChangeEvent();
  }

  public emitChangeEvent() {
    this.providerChange.emit();
  }

  public getNavChangeEmitter() {
    return this.providerChange;
  }

  emitEvent(value: string) {
    this.subject.next({ value: value });
  }
  getEvent(): Observable<any> {
    return this.subject.asObservable();
  }
}
