import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../../auth/_service/authentication.service';
import { InternalService } from '../../../auth/_service/internal.service';
import { Router } from '@angular/router';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { UserProfileService } from '../../../rest/user-profile/user-profile.service';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';
import { UserProfile } from '../../../shared/user-profile/user-profile.model';
import { UserProviderAssociation } from '../../../shared/user-profile/user-provider-association.model';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  title = 'User Profile form';
  headerMessage: string;
  showProviderKey: boolean;
  showProviderGroup: boolean;
  showUserRole: boolean;
  showModules: boolean;
  showPersona: boolean;
  editableUserId: boolean;
  editableProviderKey: boolean;
  editableProviderGroup: boolean;
  editableUserRole: boolean;
  showSearchButton: boolean;
  showCreateButton: boolean;
  showUpdateButton: boolean;
  showCancelButton: boolean;
  preserveWhitespaces: boolean;
  userProfileForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = false;
  blankScreen = false;
  id: any;
  userProviderAssociation: UserProviderAssociation;
  userProfileCreated: UserProfile;
  userProfileRetrieved: UserProfile;
  userProfileUpdated: UserProfile;
  userProfileDeleted: UserProfile;

  // hard-code the module list, for now
  modules = [{ id: 1, name: 'ACO' }, { id: 2, name: 'PCOR' }, { id: 3, name: 'UHCI' }, { id: 4, name: 'KYP' }];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private internalService: InternalService,
    private router: Router,
    private dialog: MatDialog,
    private userProfileService: UserProfileService,
    private iconRegistry: MatIconRegistry
  ) {}

  ngOnInit() {
    this.authService.getJwt().subscribe(data => {
      sessionStorage.setItem('token', JSON.stringify(data['token']));
    });
    this.preserveWhitespaces = true;
    this.loading = true;
    this.prepareForSearchForm('Enter user ID to search:');
    this.id = setTimeout(() => {
      this.loading = false;
      this.initializeUserProfilePage();
    }, 3000);
  }

  initializeUserProfilePage() {
    // Create a FormControl for each available module, initialize them as unchecked, and put them in an array
    const formControls = this.modules.map(control => new FormControl(false));

    this.userProfileForm = this.formBuilder.group({
      userId: [''],
      providerKey: [''],
      providerGroup: [''],
      userRole: [''],
      modules: new FormArray(formControls),
      persona: ['']
    });

    this.returnUrl = '/Administration/UserProfile';
    this.internalService.getPublicKey();
    this.authService.getJwt().subscribe(data => {
      sessionStorage.setItem('token', JSON.stringify(data['token']));
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  'SEARCH' BUTTON CLICK: RETRIEVE EXISTING USER-PROVIDER ASSOCIATION AND EXISTING USER PROFILE, IF ANY
  //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  onSearch() {
    this.submitted = true;
    this.loading = true;

    forkJoin(
      // call persistant datastore to get current User Profile, if any
      this.userProfileService.getUserProfile(this.f.userId.value),

      // call persistant datastore to get current User-Provider Association, if any
      this.userProfileService.getCurrentUserProviderAssociation(this.f.userId.value)
    ).subscribe(
      ([res1, res2]) => {
        // pass both User Profile and User-Provider Association to function for processing
        this.dealWithSearchCalls(res1, res2);
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
  }

  dealWithSearchCalls(userProfileRetrieved, userProviderAssociation) {
    let associationUserId = '';
    let associationProviderKey = 0;
    let associationProviderGroup = '';
    let associationUserRole = '';

    let profileProviderKey = 0;
    let profileProviderGroup = '';
    let profileModules = null;
    let profilePersona = '';

    // window.confirm('inside dealWithSearchCalls:');

    if (
      typeof userProfileRetrieved !== 'undefined' &&
      userProfileRetrieved !== null &&
      userProfileRetrieved.providerKey !== null &&
      userProfileRetrieved.providerKey !== '' &&
      userProfileRetrieved.providerGroup !== null &&
      userProfileRetrieved.providerGroup !== ''
    ) {
      // window.confirm('inside userProfileRetrieved if statement:');

      this.userProfileRetrieved = userProfileRetrieved;

      // window.confirm('about to take a look at userProfileRetrieved');

      // window.confirm('userProfileRetrieved: ' + userProfileRetrieved);

      // window.confirm('userId: ' + userProfileRetrieved.userId);
      // window.confirm('providerKey: ' + userProfileRetrieved.providerKey);
      // window.confirm('providerGroup: ' + userProfileRetrieved.providerGroup);
      // window.confirm('userRole: ' + userProfileRetrieved.userRole);

      profileProviderKey = this.userProfileRetrieved.providerKey;
      profileProviderGroup = this.userProfileRetrieved.providerGroup;
      profileModules = this.userProfileRetrieved.modules;
      profilePersona = this.userProfileRetrieved.persona;
    } else {
      // user profile does NOT exist
      this.userProfileRetrieved = null;

      // window.confirm('inside userProfileRetrieved else statement: no existing user profile in Mongo');
    }

    if (
      typeof userProviderAssociation !== 'undefined' &&
      userProviderAssociation !== null &&
      userProviderAssociation.providerKey !== null &&
      userProviderAssociation.providerKey !== ''
    ) {
      // window.confirm('inside userProviderAssociation if statement:');

      this.userProviderAssociation = userProviderAssociation;

      // window.confirm('about to take a look at userProviderAssociation');

      // window.confirm('userProviderAssociation: ' + userProviderAssociation);

      // window.confirm('userId: ' + userProviderAssociation.userId);
      // window.confirm('providerKey: ' + userProviderAssociation.providerKey);
      // window.confirm('providerGroup: ' + userProviderAssociation.providerGroup);
      // window.confirm('userRole: ' + userProviderAssociation.userRole);

      associationUserId = this.userProviderAssociation.userId;
      associationProviderKey = this.userProviderAssociation.providerKey;
      associationProviderGroup = this.userProviderAssociation.providerGroup;
      associationUserRole = this.userProviderAssociation.userRole;
    } else {
      // user-provider association does NOT exist: if user is not yet provisioned, we cannot create a
      // user profile for that person
      this.userProviderAssociation = null;

      // window.confirm('inside userProviderAssociation else statement: no existing user-provider association in Mongo');
    }

    // window.confirm('profileProviderKey: ' + profileProviderKey);
    // window.confirm('profileProviderGroup: ' + profileProviderGroup);
    // window.confirm('profileModules: ' + profileModules);
    // window.confirm('profilePersona: ' + profilePersona);

    // window.confirm('associationUserId: ' + associationUserId);
    // window.confirm('associationProviderKey: ' + associationProviderKey);
    // window.confirm('associationProviderGroup: ' + associationProviderGroup);
    // window.confirm('associationUserRole: ' + associationUserRole);

    // window.confirm('done with dealWithSearchCalls........now for the use cases');

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  NOW FOR THE USE CASES.....
    //
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // use case 1: no UserAssociation, no UserProfile
    if (this.userProviderAssociation === null && this.userProfileRetrieved === null) {
      // window.confirm('inside Use Case 1');

      // user has no provider association: go back to Search page

      this.loading = false;
      this.prepareForSearchForm('User is not yet provisioned: please enter different user ID to search:');

      // clear the form after an unsuccessful search, so administrator can search on another user
      this.clearFormControls();

      this.openMessageBox('No provider association found');
    }

    // use case 2: UserAssociation exists, but no UserProfile
    else if (this.userProviderAssociation !== null && this.userProfileRetrieved === null) {
      // window.confirm('inside Use Case 2');

      // user is provisioned, but no user profile yet: go to Create page

      // fill in provider info after microservice retrieves UserProviderAssociation from ETL load
      Object.keys(this.userProfileForm.controls).forEach(key => {
        if (key === 'providerKey') {
          this.userProfileForm.controls[key].setValue(associationProviderKey);
        }
        if (key === 'providerGroup') {
          this.userProfileForm.controls[key].setValue(associationProviderGroup);
        }
        if (key === 'userRole') {
          this.userProfileForm.controls[key].setValue(associationUserRole);
        }
      });

      this.loading = false;
      this.prepareForCreateForm('Please enter choice of module(s) and persona:');
      this.openMessageBox('No User Profile created yet: please choose module(s) and persona');
    }

    // use case 3: no UserAssociation, but UserProfile exists
    else if (this.userProviderAssociation === null && this.userProfileRetrieved !== null) {
      // window.confirm('inside Use Case 3');

      // user-provider association is GONE: must invalidate the user profile, then go back to Search page

      // Call DELETE UserProfile
      this.userProfileService.deleteUserProfile(this.f.userId.value).subscribe(
        userProfileDeleted => {
          // window.confirm('inside deleteUserProfile closure:');

          // window.confirm('userProfileDeleted: ' + userProfileDeleted);

          if (
            typeof userProfileDeleted !== 'undefined' &&
            userProfileDeleted !== null &&
            userProfileDeleted.userId === null
          ) {
            // window.confirm('inside userProfileDeleted if statement:');

            this.userProfileDeleted = userProfileDeleted;

            // window.confirm('about to take a look at userProfileDeleted');

            // window.confirm('userProfileDeleted: ' + userProfileDeleted);

            // window.confirm('userId: ' + userProfileDeleted.userId);

            this.loading = false;
            this.prepareForSearchForm('User no longer has a provider association: please enter new user ID to search:');

            // clear the form after a completed search, so administrator can search on another user
            this.clearFormControls();

            this.openMessageBox('User Profile invalidated: user no longer has a provider association');
          } else {
            // user profile NOT deleted
            this.userProfileDeleted = null;

            // window.confirm('inside userProfileDeleted else statement: no user profile deleted in Mongo');
          }
        },
        error => {
          this.error = true;
          this.loading = false;
        }
      );
    }

    // use case 4: UserAssociation exists, UserProfile exists BUT UserAssociation != UserProfile
    else if (associationProviderKey !== profileProviderKey || associationProviderGroup !== profileProviderGroup) {
      // window.confirm('inside Use Case 4');

      // must invalidate module(s), persona
      this.clearFormControls();

      // then change provider info and user role to new association values
      Object.keys(this.userProfileForm.controls).forEach(key => {
        if (key === 'userId') {
          this.userProfileForm.controls[key].setValue(associationUserId);
        }
        if (key === 'providerKey') {
          this.userProfileForm.controls[key].setValue(associationProviderKey);
        }
        if (key === 'providerGroup') {
          this.userProfileForm.controls[key].setValue(associationProviderGroup);
        }
        if (key === 'userRole') {
          this.userProfileForm.controls[key].setValue(associationUserRole);
        }
      });

      // then go to Update page

      this.loading = false;
      this.prepareForUpdateForm('User has changed providers: please enter new module(s) and persona:');
      this.openMessageBox('Current User Profile obsolete: user changed providers');
    }

    // use case 5: UserAssociation exists, UserProfile exists AND UserAssociation == UserProfile
    else if (associationProviderKey === profileProviderKey && associationProviderGroup === profileProviderGroup) {
      // window.confirm('inside Use Case 5');

      // user profile and provider assoc still match: go to Update page

      // fill in provider info after microservice retrieves UserProviderAssociation from ETL load
      Object.keys(this.userProfileForm.controls).forEach(key => {
        // window.confirm('in forEach loop, key is: ' + key);
        if (key === 'providerKey') {
          this.userProfileForm.controls[key].setValue(associationProviderKey);
        }
        if (key === 'providerGroup') {
          this.userProfileForm.controls[key].setValue(associationProviderGroup);
        }
        if (key === 'userRole') {
          this.userProfileForm.controls[key].setValue(associationUserRole);
        }
        if (key === 'modules') {
          // check the form checkbox values for now
          // window.confirm('this.userProfileForm.controls[key].value: ' + this.userProfileForm.controls[key].value);
          // window.confirm('this.userProfileForm.controls[key].value[0]: ' + this.userProfileForm.controls[key].value[0]);
          // window.confirm('this.userProfileForm.controls[key].value[1]: ' + this.userProfileForm.controls[key].value[1]);
          // window.confirm('this.userProfileForm.controls[key].value[2]: ' + this.userProfileForm.controls[key].value[2]);
          // window.confirm('this.userProfileForm.controls[key].value[3]: ' + this.userProfileForm.controls[key].value[3]);

          // compare original modules list to incoming profileModules: if match, means corresp. checkbox must be pre-checked
          this.modules.forEach(module => {
            profileModules.forEach(modVal => {
              if (modVal === module.name) {
                // window.confirm('modVal: ' + modVal + ', module.name: ' + module.name + ', module.id: ' + module.id);
                (<FormArray>this.userProfileForm.controls[key]).at(module.id - 1).setValue(true);
              }
            });
          });

          // double-check that checkboxes are now set properly
          // window.confirm('this.userProfileForm.controls[key].value: ' + this.userProfileForm.controls[key].value);
          // window.confirm('this.userProfileForm.controls[key].value[0]: ' + this.userProfileForm.controls[key].value[0]);
          // window.confirm('this.userProfileForm.controls[key].value[1]: ' + this.userProfileForm.controls[key].value[1]);
          // window.confirm('this.userProfileForm.controls[key].value[2]: ' + this.userProfileForm.controls[key].value[2]);
          // window.confirm('this.userProfileForm.controls[key].value[3]: ' + this.userProfileForm.controls[key].value[3]);
        }
        if (key === 'persona') {
          this.userProfileForm.controls[key].setValue(profilePersona);
        }
      });

      this.loading = false;
      this.prepareForUpdateForm('Please enter new values for existing module(s) and persona:');
      this.openMessageBox('Current User Profile found');
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  'CREATE' BUTTON CLICK: POST NEW USER PROFILE
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  onCreate() {
    this.submitted = true;
    this.loading = true;

    // window.confirm('inside onCreate button-click: ');

    const selectedModules = this.f.modules.value
      .map((v, i) => (v ? this.modules[i].name : null))
      .filter(v => v !== null);

    // window.confirm('const selectedModules: ' + selectedModules);

    let userProfile = new UserProfile(
      this.f.userId.value,
      this.f.providerKey.value,
      this.f.providerGroup.value,
      this.f.userRole.value,
      this.f.modules.value,
      this.f.persona.value
    );
    userProfile.modules = selectedModules;

    // window.confirm('about to take a look at const userProfile');

    // window.confirm('const userProfile: ' + userProfile);

    // window.confirm('userId: ' + userProfile.userId);
    // window.confirm('providerKey: ' + userProfile.providerKey);
    // window.confirm('providerGroup: ' + userProfile.providerGroup);
    // window.confirm('userRole: ' + userProfile.userRole);
    // window.confirm('modules: ' + userProfile.modules);
    // window.confirm('persona: ' + userProfile.persona);

    this.userProfileService.createNewUserProfile(userProfile).subscribe(
      userProfileCreated => {
        // window.confirm('inside closure response to createNewUserProfile:');

        // window.confirm('userProfileCreated: ' + userProfileCreated);

        if (
          typeof userProfileCreated !== 'undefined' &&
          userProfileCreated !== null &&
          userProfileCreated.userId !== null &&
          userProfileCreated.userId !== ''
        ) {
          // window.confirm('inside userProfileCreated if statement:');

          this.userProfileCreated = userProfileCreated;

          // window.confirm('this.userProfileCreated: ' + this.userProfileCreated);

          // window.confirm('userId: ' + this.userProfileCreated.userId);
          // window.confirm('providerKey: ' + this.userProfileCreated.providerKey);
          // window.confirm('providerGroup: ' + this.userProfileCreated.providerGroup);
          // window.confirm('userRole: ' + this.userProfileCreated.userRole);
          // window.confirm('modules: ' + this.userProfileCreated.modules);
          // window.confirm('persona: ' + this.userProfileCreated.persona);
        }
      },
      error => {
        this.error = true;
        this.loading = false;
        // window.confirm('ERROR FROM createNewUserProfile: ' + error);
      }
    );

    // window.confirm('leaving createNewUserProfile:');

    this.loading = false;
    this.prepareForSearchForm('Enter user ID to search:');

    // clear the form after creating new user profile, so administrator can search on another user
    this.clearFormControls();

    this.openMessageBox('Success: the User Profile was created');
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  'UPDATE' BUTTON CLICK: PUT CHANGED USER PROFILE
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  onUpdate() {
    this.submitted = true;
    this.loading = true;

    // window.confirm('inside onUpdate button-click: ');

    const selectedModules = this.f.modules.value
      .map((v, i) => (v ? this.modules[i].name : null))
      .filter(v => v !== null);

    // window.confirm('const selectedModules: ' + selectedModules);

    let userProfile = new UserProfile(
      this.f.userId.value,
      this.f.providerKey.value,
      this.f.providerGroup.value,
      this.f.userRole.value,
      this.f.modules.value,
      this.f.persona.value
    );
    userProfile.modules = selectedModules;

    // window.confirm('about to take a look at const userProfile');

    // window.confirm('const userProfile: ' + userProfile);

    // window.confirm('userId: ' + userProfile.userId);
    // window.confirm('providerKey: ' + userProfile.providerKey);
    // window.confirm('providerGroup: ' + userProfile.providerGroup);
    // window.confirm('userRole: ' + userProfile.userRole);
    // window.confirm('modules: ' + userProfile.modules);
    // window.confirm('persona: ' + userProfile.persona);

    this.userProfileService.updateUserProfile(userProfile).subscribe(
      userProfileUpdated => {
        // window.confirm('inside closure response to updateUserProfile:');

        // window.confirm('userProfileUpdated: ' + userProfileUpdated);

        if (
          typeof userProfileUpdated !== 'undefined' &&
          userProfileUpdated !== null &&
          userProfileUpdated.userId !== null &&
          userProfileUpdated.userId !== ''
        ) {
          // window.confirm('inside userProfileUpdated if statement:');

          this.userProfileUpdated = userProfileUpdated;

          // window.confirm('about to take a look at userProfileUpdated');

          // window.confirm('userId: ' + this.userProfileUpdated.userId);
          // window.confirm('providerKey: ' + this.userProfileUpdated.providerKey);
          // window.confirm('providerGroup: ' + this.userProfileUpdated.providerGroup);
          // window.confirm('userRole: ' + this.userProfileUpdated.userRole);
          // window.confirm('modules: ' + this.userProfileUpdated.modules);
          // window.confirm('persona: ' + this.userProfileUpdated.persona);
        }
      },
      error => {
        this.error = true;
        this.loading = false;
        // window.confirm('ERROR FROM updateUserProfile: ' + error);
      }
    );

    // window.confirm('leaving updateUserProfile:');

    this.loading = false;
    this.prepareForSearchForm('Enter user ID to search:');

    // clear the form after updating user profile, so administrator can search on another user
    this.clearFormControls();

    this.openMessageBox('Success: the User Profile was updated');
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //
  //  'CANCEL' BUTTON CLICK: RETURN TO SEARCH FORM
  //
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  onCancel() {
    // window.confirm('inside onCancel:');

    this.loading = false;
    this.prepareForSearchForm('Enter user ID to search:');

    // clear the form, as administrator wants to search on another user
    this.clearFormControls();

    this.openMessageBox('Returning to search page');
  }

  openMessageBox(message): void {
    this.blankScreen = true;
    const dialogRef = this.dialog.open(UserProfileDialogComponent, {
      width: '550px',
      height: '212px',
      data: message,
      disableClose: true,
      panelClass: 'custom'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.blankScreen = false;
      this.router.navigate([this.returnUrl]);
    });
  }

  prepareForSearchForm(pageHeaderMsg) {
    this.headerMessage = pageHeaderMsg;
    this.showProviderKey = false;
    this.showProviderGroup = false;
    this.showUserRole = false;
    this.showModules = false;
    this.showPersona = false;
    this.editableUserId = true;
    this.showSearchButton = true;
    this.showCreateButton = false;
    this.showUpdateButton = false;
    this.showCancelButton = false;
  }

  prepareForCreateForm(pageHeaderMsg) {
    this.headerMessage = pageHeaderMsg;
    this.showProviderKey = true;
    this.showProviderGroup = true;
    this.showUserRole = true;
    this.showModules = true;
    this.showPersona = true;
    this.editableUserId = false;
    this.editableProviderKey = false;
    this.editableProviderGroup = false;
    this.editableUserRole = false;
    this.showSearchButton = false;
    this.showCreateButton = true;
    this.showUpdateButton = false;
    this.showCancelButton = true;
  }

  prepareForUpdateForm(pageHeaderMsg) {
    this.headerMessage = pageHeaderMsg;
    this.showProviderKey = true;
    this.showProviderGroup = true;
    this.showUserRole = true;
    this.showModules = true;
    this.showPersona = true;
    this.editableUserId = false;
    this.editableProviderKey = false;
    this.editableProviderGroup = false;
    this.editableUserRole = false;
    this.showSearchButton = false;
    this.showCreateButton = false;
    this.showUpdateButton = true;
    this.showCancelButton = true;
  }

  // for returning to empty search form
  clearFormControls() {
    Object.keys(this.userProfileForm.controls).forEach(key => {
      if (key === 'modules') {
        this.userProfileForm.controls[key].clearValidators();
        this.userProfileForm.controls[key].reset();
      } else {
        this.userProfileForm.controls[key].clearValidators();
        this.userProfileForm.controls[key].setValue('');
      }
    });
  }

  // for getting handle on form controls
  get f() {
    return this.userProfileForm['controls'];
  }

  // for textfield validation
  valueUpdated() {
    this.error = false;
  }
}
