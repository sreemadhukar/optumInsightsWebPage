import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdministrationPageRoutingModule } from './administration-page-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileDialogComponent } from './user-profile-dialog/user-profile-dialog.component';

import { UserProfileService } from '../../rest/user-profile/user-profile.service';
import { HeadMaterialModule } from '../../head/head.material.module';
import { CommonUtilsModule } from '../../common-utils/common-utils.module';

@NgModule({
  imports: [
    CommonModule,
    AdministrationPageRoutingModule,
    CommonUtilsModule,
    HeadMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserProfileService],
  declarations: [UserProfileComponent, UserProfileDialogComponent],
  entryComponents: [UserProfileDialogComponent]
})
export class AdministrationPageModule {}
