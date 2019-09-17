import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, @Inject(DOCUMENT) private document: any) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (sessionStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }
    // User who is not advocate can't access the pages related to advocates
    if (this.router.url.includes('Advocate') && !this.advocateRole()) {
      this.router.navigate(['/OverviewPage']);
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
  advocateRole(): boolean {
    let userRoleAdvocate = false;
    try {
      if (JSON.parse(sessionStorage.getItem('loggedUser'))) {
        let userRole;
        userRole = JSON.parse(sessionStorage.getItem('loggedUser')).UserRole;
        userRoleAdvocate = userRole.some(item => item.includes('UHCI_Advocate'));
      }
    } catch (Error) {}
    return userRoleAdvocate;
  }
}
