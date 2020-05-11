import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SessionService } from './../../shared/session.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  checkAdv: any;
  checkPro: any;
  checkExecutive: any;
  isInternal = environment.internalAccess;
  constructor(private readonly router: Router, private readonly sessionService: SessionService) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.isInternal) {
      if (sessionStorage.getItem('currentUser')) {
        const expectedRole = route.data.expectedRole;
        console.log('expectedRole', expectedRole);
        this.checkAdv = this.sessionService.checkAdvocateRole();
        if (expectedRole === 'UHCI_Advocate' && this.checkAdv.value) {
          // logged in and advocate role, so return true
          return true;
        }
        if (expectedRole === 'UHCI_Project') {
          this.checkPro = this.sessionService.checkProjectRole();
          this.checkExecutive = this.sessionService.checkExecutiveRole();
          this.checkAdv = this.sessionService.checkAdvocateRole();
          if (this.checkPro.value || this.checkExecutive.value || this.checkAdv.value) {
            // logged in and project/ executive role so return true
            return true;
          }
          return true;
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
