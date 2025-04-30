import { Injectable } from '@angular/core';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cours } from 'Modeles/Cours';
import { Etape } from 'Modeles/Etape';


import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoursService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Cours[]> {
    return this.http.get<Cours[]>('http://localhost:3000/Cours');
  }

  // Fetch a single course by ID
  getCourseById(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/Cours/${id}`);
  }

  getAllCours(): Observable<Cours[]> {
    return this.getCourses();
  }

  // Fetch a course with its etapes
  getCoursWithEtapes(id: number): Observable<Cours> {
    return this.http.get<Cours>(`${this.apiUrl}/Cours/${id}`).pipe(
      map(cours => ({
        ...cours,
        etapes: cours.etapes ? cours.etapes.sort((a, b) => a.ordre - b.ordre) : []
      }))
    );
  }

  // Create a new course
  createCours(cours: Omit<Cours, 'id'>): Observable<Cours> {
    return this.http.post<Cours>(`${this.apiUrl}/Cours`, { ...cours, etapes: [] });
  }

  // Update an existing course
  updateCours(id: number, cours: Partial<Cours>): Observable<Cours> {
    return this.http.patch<Cours>(`${this.apiUrl}/Cours/${id}`, cours);
  }

  // Delete a course
  deleteCours(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Cours/${id}`);
  }
}