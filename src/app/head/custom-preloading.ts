import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { flatMap } from 'rxjs/operators';
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    console.log('preload route', route);
    const loadRoute = delay => (delay ? timer(5000).pipe(flatMap(_ => load())) : load());
    console.log('preload', route.data && route.data.preload ? loadRoute(route.data.delay) : of(null));
    return route.data && route.data.preload ? loadRoute(route.data.delay) : of(null);
  }
}
