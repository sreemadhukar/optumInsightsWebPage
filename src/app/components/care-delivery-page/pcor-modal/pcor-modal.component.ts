import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-pcor-modal',
  templateUrl: './pcor-modal.component.html',
  styleUrls: ['./pcor-modal.component.scss']
})
export class PcorModalComponent implements OnInit {
  isInternal: boolean = environment.internalAccess;
  dontShow = false;
  notificationHeader: string;
  notificationText: string;
  constructor(private dialogRef: MatDialogRef<PcorModalComponent>) {
    if (this.isInternal) {
      this.notificationHeader = 'You are being directed to the PCOR report system';
      this.notificationText = 'A new browser window will open with the internal PCOR report generator application.';
    } else {
      this.notificationHeader = "You are being directed to PCOR reports in LINK's DocuVault";
      this.notificationText = 'A new browser tab will open DocuVault.';
    }
  }

  ngOnInit() {}

  openUrl() {
    this.closeDialog();
    if (this.dontShow) {
      sessionStorage.setItem('dontShowPCORpopup', JSON.stringify(true));
    } else {
      sessionStorage.removeItem('dontShowPCORpopup');
    }
    if (this.isInternal) {
      window.open('https://webep1428/PCORMRPROD/');
    } else {
      window.open('https://www.uhcprovider.com/en/reports-quality-programs/physician-perf-based-comp.html');
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
  dontShowAgain(event) {
    if (event.target.checked) {
      this.dontShow = true;
    } else {
      this.dontShow = false;
    }
  }
}
