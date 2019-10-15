import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    const loadRoute = delay => (delay ? timer(5000).pipe(flatMap(_ => load())) : load());
    if (route && route.hasOwnProperty('data') && route.data.hasOwnProperty('preload') && route.data.preload) {
      console.log(
        'Prelaod Path ' + route.path + '. preload : ' + route.data['preload'] + '. delay : ' + route.data['delay']
      );
      return loadRoute(route.data.delay);
    } else {
      return of(null);
    }
  }
}
