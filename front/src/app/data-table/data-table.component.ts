import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  constructor(public _movieService: UserService) {}
  public movies: any = [];
  ngOnInit(): void {
    this.getMovies();
  }
  getMovies() {
    this._movieService.getMovies().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          console.log(res);
          this.movies = res.data;
        }
      },
      (error: any) => {
        console.log(error.error);
      }
    );
  }
  searchByTitle(event) {
    const value = event.target.value;
    console.log(value);
    if (value === '') {
      this.getMovies();
    }
    if (!this.isAlphaNumeric(value)) return;
    this._movieService.searchByTitle(value).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          console.log(res);
          this.movies = res.data;
        }
      },
      (error: any) => {
        console.log(error.error);
      }
    );
  }
  searchByRating(event) {
    const rating = event.target.value;
    console.log(rating);
    if (Number.isInteger(rating)) return;
    if (rating < 0 || rating > 5) return;
    this._movieService
      .searchByRating(rating)

      .subscribe(
        (res: any) => {
          if (res.status === 'success') {
            console.log(res);
            this.movies = res.data;
          }
        },
        (error: any) => {
          console.log(error.error);
        }
      );
  }
  searchByDate(event) {
    const value = event.target.value;
    console.log(value);

    this._movieService.searchByDate(value).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          console.log(res);
          this.movies = res.data;
        }
      },
      (error: any) => {
        console.log(error.error);
      }
    );
  }
  isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (
        !(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)
      ) {
        // lower alpha (a-z)
        return false;
      }
    }
    return true;
  }
}
