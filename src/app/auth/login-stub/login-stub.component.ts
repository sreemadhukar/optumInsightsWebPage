import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExternalService } from '../_service/external.service';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../_service/authentication.service';
import { InternalService } from '../_service/internal.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

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
  error = '';

  constructor(
    private external: ExternalService,
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private internalService: InternalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.returnUrl = '/OverviewPage';
    if (this.isInternal) {
      if (this.authService.isLoggedIn()) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.authService.getJwt().subscribe(data => {
          sessionStorage.setItem('token', JSON.stringify(data['token']));
        });
        this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
        });

        // reset login status
        this.authService.logout();
      }
    } else {
      this.external.CheckExternal();
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    //  this.loading = true;
    this.internalService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(data);
          // this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
