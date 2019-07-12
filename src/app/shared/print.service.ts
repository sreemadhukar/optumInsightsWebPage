import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  printPage: EventEmitter<any> = new EventEmitter();
  constructor() {}
  emitNavChangeEvent() {
    this.printPage.emit();
  }
  getNavChangeEmitter() {
    return this.printPage;
  }
}
