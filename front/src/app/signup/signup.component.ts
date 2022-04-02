import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _fb: FormBuilder
  ) {}
  private hasError: boolean = false;
  private emailReg = /[a-z0-9._%+-]+@[a-z0-9.-]+\.([a-z]{3})+(\.([a-z]{2,}))?$/;
  userForm: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.pattern(this.emailReg)]],
    password: [null, [Validators.required]],
    passwordConfirm: [null, [Validators.required]],
  });
  isValidUser(controlName: string) {
    return (
      (this.userForm.get(controlName)!.invalid &&
        this.userForm.get(controlName)!.touched) ||
      (this.hasError && this.userForm.get(controlName).invalid)
    );
  }

  signupUser() {
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      this.hasError = true;
      return;
    }
    this.hasError = false;
    this._auth.signup(this.userForm.value).subscribe(
      (res) => {
        console.log(res);
        if (res.status === 'success') {
          this._auth.setUser(res.token, res.data.user);
          Swal.fire({
            icon: 'success',
            title: 'Accoutnt created successfully',
          }).then(() => {
            this._router.navigate(['/']);
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'something went wrong',
          });
        }
      },
      (error: any) => {
        console.log(error.error);
      }
    );
  }
}
