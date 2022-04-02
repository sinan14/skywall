import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _host: string = environment.baseUrl;
  private tokenExpirationTimer: any;
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  constructor(private _http: HttpClient, private _router: Router) {}

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  autoLogin() {
    const loggedIn = this.loggedIn();
    if (loggedIn) return;
    const userData = JSON.parse(localStorage.getItem('userData'));
    const expirationDuration =
      new Date(userData.expirationDuration).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  logout() {
    this._router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  setUser(token: any, User: any) {
    const exp = 1000 * 60 * 60 * 24 * 7;
    const user = User;
    // delete user['role'];
    const expirationDuration = new Date(new Date().getTime() + exp);
    const userData = {
      expirationDuration,
      token,
      ...user,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    this.autoLogout(exp);
  }

  getToken() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      console.log(userData.token);
      return userData.token;
    }
    return null;
  }
  isAdmin() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData.role === 'admin') return true;
    return false;
  }
  loggedIn() {
    return !!localStorage.getItem('userData');
  }

  login(user: any) {
    const api = `${this._host}/user/login`;
    return this._http.post<any>(api, user).pipe(catchError(this.handleError));
  }
  signup(user: any) {
    const api = `${this._host}/user/signup`;
    return this._http.post<any>(api, user).pipe(catchError(this.handleError));
  }
}
