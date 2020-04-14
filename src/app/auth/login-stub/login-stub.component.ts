import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ExternalService } from '../_service/external.service';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../_service/authentication.service';
import { InternalService } from '../_service/internal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { SessionService } from '../../shared/session.service';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { ProviderSearchComponent } from '../../common-utils/provider-search/provider-search.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthorizationService } from '../_service/authorization.service';
import { DOCUMENT } from '@angular/common';
import { EncryptMsidService } from '../_service/encrypt-msid.service';

@Component({
  selector: 'app-login-stub',
  templateUrl: './login-stub.component.html',
  styleUrls: ['./login-stub.component.scss']
})
export class LoginStubComponent implements OnInit {
  currentYear = new Date().getFullYear();
  isInternal: boolean = environment.internalAccess;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = false;
  blankScreen = false;
  id: any;
  token: string;
  showWarning = false;
  sessionTimedoutMessage: any = {
    note: 'Due to inactivity, we have logged you out.',
    message: 'To return to UHC Insights, please sign in below.'
  };
  public checkAdv;
  public checkPro;
  public checkExecutive;
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;

  constructor(
    private external: ExternalService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private internalService: InternalService,
    private router: Router,
    private providerSharedService: ProviderSharedService,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private authorise: AuthorizationService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private encryptMsidService: EncryptMsidService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.checkAdv = this.sessionService.checkAdvocateRole();
    this.checkPro = this.sessionService.checkProjectRole();
    this.checkExecutive = this.sessionService.checkExecutiveRole();
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );
  }

  ngOnInit() {
    // to close all opened dialogbox at after logout at login page
    this.dialog.closeAll();
    sessionStorage.setItem('cache', JSON.stringify(false));
    if (!environment.production) {
      this.authService.getJwt().subscribe(data => {
        sessionStorage.setItem('token', JSON.stringify(data['token']));
        this.token = data['token'];
      });
    } else {
      this.cookieService.deleteAll('/');
      this.token = 'isProd';
    }
    this.loading = true;
    this.id = setTimeout(() => {
      this.loading = false;
      this.initLogin();
    }, 3000);

    const queryParams = this.route.snapshot.queryParams;

    // do something with the parameters
    if (queryParams.sessionExpired) {
      this.showWarning = true;
    } else {
      this.showWarning = false;
    }
  }

  initLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = '/ProviderSearch';
    if (this.isInternal) {
      this.blankScreen = false;
      sessionStorage.clear();
      sessionStorage.setItem('cache', JSON.stringify(false));
      this.sessionService.emitChangeEvent();
      this.authService.getJwt().subscribe(data => {
        sessionStorage.setItem('token', JSON.stringify(data['token']));
        this.internalService.getPublicKey();
      });
      if (this.authService.isLoggedIn()) {
        if (JSON.parse(sessionStorage.getItem('currentUser'))[0]['ProviderKey']) {
          if (this.checkAdv.value) {
            // window.location.href = '/OverviewPageAdvocate';
            window.location.href = '/OverviewPageAdvocate/Home';
          } else if (this.checkPro.value || this.checkExecutive.value) {
            window.location.href = '/NationalExecutive';
          }
          // else if (this.checkPro.value) {
          //   window.location.href = '/OverviewPage';
          // }
        } else {
          this.router.navigate([this.returnUrl]);
        }
      } else {
        this.internalService.getPublicKey();
        this.authService.getJwt().subscribe(data => {
          sessionStorage.setItem('token', JSON.stringify(data['token']));
        });
      }
    } else {
      if (this.route.queryParams) {
        this.route.queryParams.subscribe(params => {
          if (params.emulatedUuid) {
            sessionStorage.clear();
            sessionStorage.setItem('cache', JSON.stringify(false));
            sessionStorage.setItem('emulatedUuid', JSON.stringify(params.emulatedUuid));
          }
          if (params.code && !this.authService.isLoggedIn()) {
            this.external
              .CheckExternal(params.code, this.token)
              .then(value => {
                let response: any;
                response = value;
                this.authorise.getToggles('external-authorise').subscribe(value1 => {
                  console.log(value1);
                });
                sessionStorage.setItem('cache', JSON.stringify(true));
                if (response.Providers.length > 1) {
                  this.router.navigate(['/ProviderSearch']);
                } else {
                  this.router.navigate(['/OverviewPage']);
                }
              })
              .catch(error => {
                // this.openErrorDialog();
                this.router.navigate(['/AccessDenied']);
              });
          } else if (this.authService.isLoggedIn()) {
            sessionStorage.setItem('cache', JSON.stringify(true));
            this.router.navigate(['/OverviewPage']);
          } else {
            this.document.location.href = environment.apiUrls.SsoRedirectUri;
          }
        });
      } else {
        this.document.location.href = environment.apiUrls.SsoRedirectUri;
      }
    }
  }

  get f() {
    return this.loginForm['controls'];
  }

  valueUpdated() {
    this.error = false;
  }

  onSubmit() {
    this.blankScreen = true;
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      this.blankScreen = false;
      return;
    } else {
      this.internalService.login(this.f.username.value, this.f.password.value).subscribe(
        user => {
          this.blankScreen = true;
          this.loading = false;
          const msidValue = this.f.username.value.toLowerCase();
          sessionStorage.setItem('MsId', this.encryptMsidService.encryptMsId(msidValue));
          this.authorise.getToggles('authorise').subscribe(value => {
            console.log(value);
          });
          if (environment.internalAccess) {
            this.authorise.getTrendAccess(this.f.username.value).subscribe(value => {
              console.log(value);
            });
          }
          if (user && user['UserPersonas'].some(item => item.UserRole.includes('UHCI_Executive'))) {
            this.router.navigate(['/NationalExecutive']);
          } else if (user && user['UserPersonas'].some(item => item.UserRole.includes('UHCI_Project'))) {
            this.router.navigate(['/NationalExecutive']);
          } else if (user && user['UserPersonas'].some(item => item.UserRole.includes('UHCI_Advocate'))) {
            this.router.navigate(['/OverviewPageAdvocate/Home']);
          } else {
            this.router.navigate(['/ProviderSearch']);
          }
        },
        error => {
          this.error = true;
          this.loading = false;
          this.blankScreen = false;
          this.submitted = false;
        }
      );
    }
  }

  openDialog(): void {
    this.blankScreen = true;
    const dialogRef = this.dialog.open(ProviderSearchComponent, {
      width: '550px',
      height: '212px',
      disableClose: true,
      panelClass: 'custom'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!sessionStorage.getItem('currentUser')) {
        this.blankScreen = false;
      }
      this.router.navigate([this.returnUrl]);
    });
  }

  openErrorDialog(): void {
    this.blankScreen = true;
    const dialogErrorRef = this.dialog.open(this.errorDialog, {
      width: '550px',
      height: '212px',
      disableClose: true,
      panelClass: 'custom'
    });

    dialogErrorRef.afterClosed().subscribe(result => {
      if (!environment.internalAccess) {
        this.document.location.href = environment.apiUrls.linkLoginPage;
      }
    });
  }
}
