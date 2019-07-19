import { Component, Inject, OnInit } from '@angular/core';
import { MatIconRegistry, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.scss']
})
export class UserProfileDialogComponent implements OnInit {
  constructor(
    private iconRegistry: MatIconRegistry,
    private dialogRef: MatDialogRef<UserProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'cross',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Content/round-clear-24px.svg')
    );
  }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
