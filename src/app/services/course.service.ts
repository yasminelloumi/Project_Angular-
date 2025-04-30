import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cours } from 'Modeles/Cours';
import { Etape } from 'Modeles/Etape';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>('http://localhost:3000/Cours');
  }

  getCourseById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/Cours/${id}`);
  }
 


  getAllCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/Cours`);
  }

  getCoursWithEtapes(id: number): Observable<Cours> {
    return forkJoin({
      cours: this.http.get<Cours>(`${this.apiUrl}/Cours/${id}`),
      etapes: this.http.get<Etape[]>(`${this.apiUrl}/etapes?coursId=${id}`)
    }).pipe(
      map(result => ({
        ...result.cours,
        etapes: result.etapes.sort((a, b) => a.ordre - b.ordre)
      }))
    );
  }

  createCours(cours: Omit<Cours, 'id'>): Observable<Cours> {
    return this.http.post<Cours>(`${this.apiUrl}/Cours`, cours);
  }

  updateCours(id: number, cours: Partial<Cours>): Observable<Cours> {
    return this.http.patch<Cours>(`${this.apiUrl}/Cours/${id}`, cours);
  }

  deleteCours(id: number): Observable<void> {
    return this.http.get<Etape[]>(`${this.apiUrl}/etapes?coursId=${id}`).pipe(
      switchMap(etapes => {
        const deleteRequests = etapes.map(etape =>
          this.http.delete(`${this.apiUrl}/etapes/${etape.id}`)
        );
        return forkJoin(deleteRequests.length ? deleteRequests : [null]);
      }),
      switchMap(() => this.http.delete<void>(`${this.apiUrl}/Cours/${id}`))
    );
  }
}
