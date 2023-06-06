import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Curso } from './curso';
import { delay, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CursosService {
  private readonly API = `${environment.API}cursos`;

  constructor(private http: HttpClient) {}

  list() {
    return this.http
      .get<Curso[]>(this.API)
      .pipe
      // delay(2000),
      //tap(console.log)
      ();
  }

  loadById(id: number) {
    return this.http.get<Curso>(`${this.API}/${id}`).pipe(take(1));
  }

  create(curso: any) {
    return this.http.post(this.API, curso).pipe(take(1));
  }
}
