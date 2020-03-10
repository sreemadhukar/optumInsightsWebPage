import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printPage: EventEmitter<any> = new EventEmitter();
  private printSelectorEvent = new Subject<any>();

  constructor() {}
  emitNavChangeEvent() {
    this.printPage.emit();
  }
  getNavChangeEmitter() {
    return this.printPage;
  }

  emitPrintChangeEvent(bool: boolean) {
    this.printSelectorEvent.next({ value: bool });
  }
  getPrintChangeEmitter(): Observable<any> {
    return this.printSelectorEvent.asObservable();
  }
}
