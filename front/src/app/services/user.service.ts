import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private _host: string = environment.baseUrl;
  public pdfLink: string = '';
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  getMovies() {
    const api = `${this._host}/movie`;
    return this.http.get<any>(api).pipe(catchError(this.handleError));
  }
  searchByTitle(key) {
    const api = `${this._host}/movie/commonSearch/${key}`;
    return this.http.get<any>(api).pipe(catchError(this.handleError));
  }
  searchByRating(rating) {
    const api = `${this._host}/movie?ratings[gte]=${rating}`;
    return this.http.get<any>(api).pipe(catchError(this.handleError));
  }
  searchByDate(date) {
    const api = `${this._host}/movie?year[gte]=${date}`;
    return this.http.get<any>(api).pipe(catchError(this.handleError));
  }
}
