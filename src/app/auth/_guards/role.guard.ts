import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/shared/session.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const checkAdv: any = this.sessionService.checkAdvocateRole();
    if (sessionStorage.getItem('currentUser')) {
      const expectedRole = route.data.expectedRole;
      if (expectedRole === 'UHCI_Advocate') {
        if (checkAdv.value) {
          // logged in so return true
          return true;
        }
      }
    }

    // not logged in so redirect to login page with the return url
    sessionStorage.clear();
    sessionStorage.setItem('cache', JSON.stringify(false));
    this.router.navigate(['/login']);
    return false;
  }
}
