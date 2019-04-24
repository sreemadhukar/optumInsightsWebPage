import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ThemeService {
  public _darkTheme: Subject<boolean> = new Subject<boolean>();
  isDarkTheme = this._darkTheme.asObservable();

  setDarkTheme(isDarkTheme: boolean) {
    this._darkTheme.next(isDarkTheme);
  }
}
