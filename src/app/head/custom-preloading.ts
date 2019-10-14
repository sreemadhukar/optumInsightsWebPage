import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      console.log('Prelaod Path ' + route.path + '. delay : ' + route.data['delay']);
      if (route.data['delay']) {
        return timer(5000).pipe(flatMap(_ => load()));
      }
      return load();
    } else {
      return of(null);
    }
  }
}
