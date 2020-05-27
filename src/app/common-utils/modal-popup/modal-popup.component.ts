import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.scss']
})
export class ModalPopupComponent {
  dontShow = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancelText: string;
      confirmText: string;
      dontShowText: string;
      message: string;
      title: string;
    },

    private mdDialogRef: MatDialogRef<ModalPopupComponent>
  ) {}
  public cancel() {
    this.close(false);
  }
  public close(value) {
    this.mdDialogRef.close(value);
    if (this.dontShow) {
      sessionStorage.setItem('dontShowPCORpopup', JSON.stringify(true));
    } else {
      sessionStorage.removeItem('dontShowPCORpopup');
    }
  }
  public confirm() {
    this.close(true);
  }
  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }
  dontShowAgain(event) {
    if (event.target.checked) {
      this.dontShow = true;
    } else {
      this.dontShow = false;
    }
  }
}
