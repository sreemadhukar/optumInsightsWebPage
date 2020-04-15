import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/shared/session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  checkAdv: any;
  checkPro: any;
  checkExecutive: any;
  isInternal = environment.internalAccess;
  constructor(private router: Router, private sessionService: SessionService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isInternal) {
      if (sessionStorage.getItem('currentUser')) {
        const expectedRole = route.data.expectedRole;
        if (expectedRole === 'UHCI_Advocate') {
          this.checkAdv = this.sessionService.checkAdvocateRole();
          if (this.checkAdv.value) {
            // logged in and advocate role, so return true
            return true;
          }
        } else if (expectedRole === 'UHCI_Project') {
          this.checkPro = this.sessionService.checkProjectRole();
          this.checkExecutive = this.sessionService.checkExecutiveRole();
          this.checkAdv = this.sessionService.checkAdvocateRole();
          if (this.checkPro.value || this.checkExecutive.value || this.checkAdv.value) {
            // logged in and project/ executive role so return true
            return true;
          }
        }
      }
      // not logged in so redirect to login page with the return url
      sessionStorage.clear();
      sessionStorage.setItem('cache', JSON.stringify(false));
      this.router.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }
}
