import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Etape } from 'Modeles/Etape';

@Injectable({
  providedIn: 'root'
})
export class EtapeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Get all steps for a course
  getEtapesByCours(coursId: number): Observable<Etape[]> {
    return this.http.get<Etape[]>(`${this.apiUrl}/etapes?coursId=${coursId}&_sort=ordre`);
  }

  // Get step by id
  getEtape(id: number): Observable<Etape> {
    return this.http.get<Etape>(`${this.apiUrl}/etapes/${id}`);
  }

  // Create a new step
  createEtape(etape: Omit<Etape, 'id'>): Observable<Etape> {
    return this.http.post<Etape>(`${this.apiUrl}/etapes`, etape);
  }

  // Update a step
  updateEtape(id: number, etape: Partial<Etape>): Observable<Etape> {
    return this.http.patch<Etape>(`${this.apiUrl}/etapes/${id}`, etape);
  }

  // Delete a step
  deleteEtape(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/etapes/${id}`);
  }

  // Reorder steps for a course
  reorderEtapes(coursId: number, etapes: Etape[]): Observable<Etape[]> {
    const updateRequests = etapes.map((etape, index) => {
      return this.updateEtape(etape.id, { ordre: index + 1 });
    });
    return this.http.get<Etape[]>(`${this.apiUrl}/etapes?coursId=${coursId}&_sort=ordre`);
  }
}