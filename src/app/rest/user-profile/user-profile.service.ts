import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { UserProfile } from '../../shared/user-profile/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  public currentUser: any;
  private authBearer: any;
  private APP_URL: string = environment.apiProxyUrl;
  private CURRENT_USER_PROV_ASSOC_SERVICE_PATH: string = environment.apiUrls.CurrentUserProviderAssociation;
  private NEW_USER_PROFILE_SERVICE_PATH: string = environment.apiUrls.NewUserProfile;
  private CURRENT_USER_PROFILE_SERVICE_PATH: string = environment.apiUrls.CurrentUserProfile;
  private UPDATED_USER_PROFILE_SERVICE_PATH: string = environment.apiUrls.UpdatedUserProfile;
  private DELETED_USER_PROFILE_SERVICE_PATH: string = environment.apiUrls.DeletedUserProfile;
  constructor(private http: HttpClient) {}

  /* Function to get current user-provider association, by user ID */
  public getCurrentUserProviderAssociation(userIdArg) {
    // window.confirm('inside getCurrentUserProviderAssociation:');
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*',
        'Content-Type': 'application/json'
      });

      let params = new HttpParams();
      params = params.append('userId', userIdArg);

      // const currentUserProviderAssociationURL = this.APP_URL + this.CURRENT_USER_PROV_ASSOC_SERVICE_PATH + userId;
      const currentUserProviderAssociationURL = 'http://localhost:8081/api/v1/userproviderassociation';
      // window.confirm('currentUserProviderAssociationURL: ' + currentUserProviderAssociationURL);
      // window.confirm('headers: ' + myHeader);

      return this.http.get(currentUserProviderAssociationURL, { params: params, headers: myHeader }).pipe(
        retry(2),
        map(data => {
          return data;
        }),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }

  /* Function to get current user profile, by user ID */
  public getUserProfile(userIdArg) {
    // window.confirm('inside getUserProfile:');
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*',
        'Content-Type': 'application/json'
      });

      let params = new HttpParams();
      params = params.append('userId', userIdArg);

      // const currentUserProfileURL = this.APP_URL + this.CURRENT_USER_PROFILE_SERVICE_PATH + userId;
      const currentUserProfileURL = 'http://localhost:8081/api/v1/userprofile';
      // window.confirm('currentUserProfileURL: ' + currentUserProfileURL);

      return this.http.get(currentUserProfileURL, { params: params, headers: myHeader }).pipe(
        retry(2),
        map(data => {
          return data;
        }),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }

  /* Function to create new user profile, by user ID */
  public createNewUserProfile(userProfileArg: UserProfile) {
    // window.confirm('inside createNewUserProfile:');
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*'
      });

      // const newUserProfileURL = this.APP_URL + this.NEW_USER_PROFILE_SERVICE_PATH;
      const newUserProfileURL = 'http://localhost:8081/api/v1/userprofile';
      // window.confirm('newUserProfileURL: ' + newUserProfileURL);

      // window.confirm('about to take a look at userProfileArg');
      // window.confirm('userProfileArg: ' + userProfileArg);

      // window.confirm('userId: ' + userProfileArg.userId);
      // window.confirm('providerKey: ' + userProfileArg.providerKey);
      // window.confirm('providerGroup: ' + userProfileArg.providerGroup);
      // window.confirm('userRole: ' + userProfileArg.userRole);
      // window.confirm('modules: ' + userProfileArg.modules);
      // window.confirm('persona: ' + userProfileArg.persona);

      return this.http.post(newUserProfileURL, userProfileArg, { headers: myHeader }).pipe(
        retry(2),
        map(res => res),
        catchError(err => of(err))
      );
    }
  }

  /* Function to update existing user profile, by user ID */
  public updateUserProfile(userProfileArg: UserProfile) {
    // window.confirm('inside updateUserProfile:');
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*'
      });

      // const updatedUserProfileURL = this.APP_URL + this.UPDATED_USER_PROFILE_SERVICE_PATH;
      const updatedUserProfileURL = 'http://localhost:8081/api/v1/userprofile';
      // window.confirm('updatedUserProfileURL: ' + updatedUserProfileURL);

      // window.confirm('about to take a look at userProfileArg');
      // window.confirm('userProfileArg: ' + userProfileArg);

      // window.confirm('userId: ' + userProfileArg.userId);
      // window.confirm('providerKey: ' + userProfileArg.providerKey);
      // window.confirm('providerGroup: ' + userProfileArg.providerGroup);
      // window.confirm('userRole: ' + userProfileArg.userRole);
      // window.confirm('modules: ' + userProfileArg.modules);
      // window.confirm('persona: ' + userProfileArg.persona);

      return this.http.put(updatedUserProfileURL, userProfileArg, { headers: myHeader }).pipe(
        retry(2),
        map(res => res),
        catchError(err => of(err))
      );
    }
  }

  /* Function to delete existing user profile, by user ID */
  public deleteUserProfile(userIdArg) {
    // window.confirm('inside deleteUserProfile:');
    if (JSON.parse(sessionStorage.getItem('currentUser'))) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
      this.authBearer = this.currentUser[0].PedAccessToken;
      const myHeader = new HttpHeaders({
        Authorization: 'Bearer ' + this.authBearer,
        Accept: '*/*'
      });

      let params = new HttpParams();
      params = params.append('userId', userIdArg);

      // const deleteUserProfileURL = this.APP_URL + this.DELETED_USER_PROFILE_SERVICE_PATH + userId;
      const deleteUserProfileURL = 'http://localhost:8081/api/v1/userprofile';
      // window.confirm('deleteUserProfileURL: ' + deleteUserProfileURL);

      return this.http.delete(deleteUserProfileURL, { params: params, headers: myHeader }).pipe(
        retry(2),
        map(data => {
          return data;
        }),
        catchError(err => of(JSON.parse(JSON.stringify(err))))
      );
    }
  }
}
