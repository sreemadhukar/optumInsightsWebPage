import { Component, OnDestroy, Inject, ViewEncapsulation } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { map, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../_service/authentication.service';

@Component({
  selector: 'app-idle-timeout-dialog',
  templateUrl: './idle-timeout-dialog.component.html',
  styleUrls: ['./idle-timeout-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IdleTimeoutDialogComponent implements OnDestroy {
  timeLeftSeconds: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    public dialogRef: MatDialogRef<IdleTimeoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.timeLeftSeconds = data.timeOut;
    this._unsubscribeAll = new Subject();
    const countDown = interval(1000).pipe(
      map(value => {
        return --this.timeLeftSeconds;
      })
    );

    // Subscribe to the countdown interval
    countDown.pipe(takeUntil(this._unsubscribeAll)).subscribe(value => {
      this.timeLeftSeconds = value;
      if (this.timeLeftSeconds === 1) {
        this.onLogoutClick(1);
      }
    });
    console.log(this.router.url);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onLogoutClick(e = 0): void {
    this.dialogRef.close();
    this.authService.logout(e);
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
