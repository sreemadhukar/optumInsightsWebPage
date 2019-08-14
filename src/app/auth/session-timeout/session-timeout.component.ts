import { Component, OnInit, Inject } from '@angular/core';
import { Idle } from '@ng-idle/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment';
import { LogoutService } from '../_service/logout.service';

@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})
export class SessionTimeoutComponent implements OnInit {
  display = 'block';
  isTimedOut = false;

  public uuid: any;
  public currentUser: any;

  constructor(idleService: Idle, private logoutEvent: LogoutService, @Inject(DOCUMENT) private document: any) {
    idleService.onTimeout.subscribe(() => (this.isTimedOut = true));
  }

  ngOnInit() {
    if (environment.internalAccess) {
      this.document.location.href = '/';
    } else {
      this.uuid = this.currentUser[0].Uuid;
      this.logoutEvent.postLogoutEvent(this.uuid).subscribe(
        data => {
          if (data == undefined || data == null || data === '') {
            sessionStorage.removeItem('currentUser');
            const redirectUri = environment.apiUrls.linkLoginPage;
            this.document.location.href = redirectUri;
          } else {
            console.log('Logout response is not NULL/Void/undefined', data);
          }
        },
        error => {
          console.log('Error| Session Timeout Header Logout', error);
        }
      );
    } // end if else block
  }
}
