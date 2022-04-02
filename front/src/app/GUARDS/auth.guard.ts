import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}
  canActivate(): boolean {
    if (this._auth.isAdmin()) {
      // Swal.fire('Are You Sure').then(() => {});
      return true;
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'you are not allowed to do that',
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        this._router.navigate(['/login']);
      });
      return false;
    }
  }
}
