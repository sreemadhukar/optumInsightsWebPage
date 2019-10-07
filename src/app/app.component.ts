import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, Event } from '@angular/router';
import { MatDialog } from '@angular/material';
import { UserIdleService } from 'angular-user-idle';
import { tap } from 'rxjs/operators';
import { IdleTimeoutDialogComponent } from './auth/idle-timeout-dialog/idle-timeout-dialog.component';
import { FilterCloseService } from './shared/filters/filter-close.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webui2';
  countdown: any;

  idle: number;
  timeout: number;
  ping: number;
  lastPing: string;
  isWatching: boolean;
  isTimer: boolean;
  timeIsUp: boolean;
  timerCount: number;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userIdle: UserIdleService,
    private filterClose: FilterCloseService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
        console.log('NavigationEnd' + this.router.url);
        if (!sessionStorage.getItem('currentUser')) {
          this.onStartWatching(false);
          this.isWatching = false;
        } else {
          if (!this.isWatching) {
            this.onStartWatching(true);
          }
        }
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        console.log(event.error);
      }
    });

    this.countdown = {
      days: '',
      hours: '',
      minutes: '',
      seconds: ''
    };
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(IdleTimeoutDialogComponent, {
      width: '550px',
      disableClose: true,
      data: { timeOut: this.timeout }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(this.router.url);
      this.userIdle.stopWatching();
      if (!sessionStorage.getItem('currentUser')) {
        this.onStartWatching(false);
      } else {
        console.log('watching started');
        this.onStartWatching(true);
      }
    });
  }

  onStartWatching(isToWatch: boolean): void {
    if (isToWatch) {
      this.idle = this.userIdle.getConfigValue().idle;
      this.timeout = this.userIdle.getConfigValue().timeout;
      // this.ping = this.userIdle.getConfigValue().ping;
      console.log(this.idle, this.timeout);
      this.isWatching = true;
      this.timeIsUp = false;
      this.timerCount = this.timeout;
      this.userIdle.setConfigValues({
        idle: this.idle,
        timeout: this.timeout,
        ping: this.ping
      });

      // Start watching for user inactivity.
      this.userIdle.startWatching();
      // Start watching when user idle is starting.
      this.userIdle
        .onTimerStart()
        .pipe(
          tap(() => {
            this.isTimer = true;
            console.log('is time up' + this.timeIsUp);
            if (this.timerCount === this.timeout && !this.timeIsUp) {
              this.openDialog();
            }
          })
        )
        .subscribe(count => (this.timerCount = count));

      // Start watch when time is up.
      this.userIdle.onTimeout().subscribe(() => {
        this.timeIsUp = true;
        /*
        for login page filters has no role to play, so for them Filters should be close,
         we are calling it explicity because suppose user clicks on Filter and filter drawer opens up, now logout
         occures, user will land to the login screen with filter drawer opened, so that is the issue,
         To tackle that we have service which we imported at app.component so when user's timesout it will publish the
         the value, which we subscribed using Subject 'filterClose'.
          */
        this.filterClose.setfilterClose(true);
        this.dialog.closeAll();
      });
    }
  }
}
