import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalService } from '../_service/external.service';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../_service/authentication.service';
import { InternalService } from '../_service/internal.service';
import { Router } from '@angular/router';
import { ProviderSharedService } from '../../shared/provider/provider-shared.service';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { ProviderSearchComponent } from '../../common-utils/provider-search/provider-search.component';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private external: ExternalService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private internalService: InternalService,
    private router: Router,
    private providerSharedService: ProviderSharedService,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'error',
      sanitizer.bypassSecurityTrustResourceUrl('/src/assets/images/icons/Alert/round-error_outline-24px.svg')
    );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = '/OverviewPage';
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
      this.external.CheckExternal();
    }
  }

  get f() {
    return this.loginForm['controls'];
  }

  valueUpdated() {
    this.error = false;
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.internalService.login(this.f.username.value, this.f.password.value).subscribe(
      () => {
        this.loading = false;
        this.openDialog();
      },
      error => {
        this.error = true;
        this.loading = false;
      }
    );
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
      this.blankScreen = false;
      this.router.navigate([this.returnUrl]);
    });
  }
}
