import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalService } from '../_service/external.service';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../_service/authentication.service';
import { InternalService } from '../_service/internal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { ProviderSearchComponent } from '../../common-utils/provider-search/provider-search.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthorizationService } from '../_service/authorization.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login-stub',
  templateUrl: './login-stub.component.html',
  styleUrls: ['./login-stub.component.scss']
})
export class LoginStubComponent implements OnInit {
  isInternal: boolean = environment.internalAccess;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = false;
  blankScreen = false;
  id: any;
  token: string;
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
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );
  }

  ngOnInit() {
    this.authService.getJwt().subscribe(data => {
      sessionStorage.setItem('token', JSON.stringify(data['token']));
      this.token = data['token'];
    });
    this.loading = true;
    this.id = setTimeout(() => {
      this.loading = false;
      this.initLogin();
    }, 3000);
  }

  initLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = '/ProviderSearch';
    if (this.isInternal) {
      if (this.authService.isLoggedIn()) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.internalService.getPublicKey();
        this.authService.getJwt().subscribe(data => {
          sessionStorage.setItem('token', JSON.stringify(data['token']));
        });
      }
    } else {
      if (this.route.queryParams) {
        this.route.queryParams.subscribe(params => {
          if (params.code && !this.authService.isLoggedIn()) {
            this.external
              .CheckExternal(params.code, this.token)
              .then(value => {
                this.authorise.getToggles().subscribe(value1 => {});
                this.router.navigate(['/OverviewPage']);
              })
              .catch(error => {
                this.openErrorDialog();
              });
          } else if (this.authService.isLoggedIn()) {
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
        () => {
          this.blankScreen = true;
          this.loading = false;
          this.authorise.getToggles().subscribe(value => {
            console.log(value);
          });
          // this.openDialog();
          this.router.navigate(['/ProviderSearch']);
        },
        error => {
          this.error = true;
          this.loading = false;
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
        this.document.location.href = 'https://provider-stage.linkhealth.com/';
      }
    });
  }
}
