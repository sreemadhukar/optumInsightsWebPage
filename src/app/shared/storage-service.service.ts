import { Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements OnDestroy {
  providerChange: EventEmitter<any> = new EventEmitter();
  private onSubject = new Subject<{ key: string; value: any }>();
  private changes = this.onSubject.asObservable().pipe(share());
  private subject = new Subject<any>();

  constructor(private route: Router) {
    // this.start();
  }

  ngOnDestroy() {
    //  this.stop();
  }

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

  // private start(): void {
  //   window.addEventListener('storage', this.storageEventListener.bind(this));
  // }

  // private storageEventListener(event: StorageEvent) {
  //   alert(1);
  //   console.log(event);
  //   if (event.storageArea === sessionStorage) {
  //     console.log(event.newValue[0]);
  //     if (event.newValue) {
  //       alert('emitted');
  //       this.emitChangeEvent();
  //     }
  //   }
  // }

  // private stop(): void {
  //   window.removeEventListener('storage', this.storageEventListener.bind(this));
  //   this.onSubject.complete();
  // }
}
