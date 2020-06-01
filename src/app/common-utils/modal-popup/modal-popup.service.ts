import { ModalPopupComponent } from './modal-popup.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModalPopupService {
  dialogRef: MatDialogRef<ModalPopupComponent>;
  constructor(private dialog: MatDialog) {}

  public open(options) {
    this.dialogRef = this.dialog.open(ModalPopupComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        dontShowText: options.dontShowText,
        confirmText: options.confirmText
      },
      width: '550px',
      panelClass: 'custom-dialog-container'
    });
  }
  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(
      take(1),
      map(res => {
        return res;
      })
    );
  }
}
