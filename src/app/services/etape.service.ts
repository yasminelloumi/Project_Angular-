
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Etape } from 'Modeles/Etape';
import { CoursService } from './course.service';
import { Cours } from 'Modeles/Cours';

@Injectable({
  providedIn: 'root'
})
export class EtapeService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private coursService: CoursService
  ) {}

  // Get all steps for a course
  getEtapesByCours(coursId: number): Observable<Etape[]> {
    return this.coursService.getCoursWithEtapes(coursId).pipe(
      map(cours => cours.etapes || [])
    );
  }

  // Get step by id
  getEtape(coursId: number, etapeId: number): Observable<Etape> {
    return this.coursService.getCoursWithEtapes(coursId).pipe(
      map(cours => {
        const etape = cours.etapes.find(e => e.id === etapeId);
        if (!etape) {
          throw new Error(`Etape with ID ${etapeId} not found`);
        }
        return etape;
      })
    );
  }

  // Create a new step
  createEtape(coursId: number, etape: Omit<Etape, 'id'>): Observable<Etape> {
    return this.coursService.getCoursWithEtapes(coursId).pipe(
      switchMap(cours => {
        const newEtapeId = this.generateEtapeId(cours.etapes);
        const newEtape: Etape = {
          ...etape,
          id: newEtapeId,
          contentType: etape.contentType || 'text', // Default contentType
          contentData: etape.contentData || ''
        };
        const updatedEtapes = [...cours.etapes, newEtape];
        return this.coursService.updateCours(coursId, { etapes: updatedEtapes }).pipe(
          map(() => newEtape)
        );
      })
    );
  }

  // Update a step
  updateEtape(coursId: number, etapeId: number, etape: Partial<Etape>): Observable<Etape> {
    return this.coursService.getCoursWithEtapes(coursId).pipe(
      switchMap(cours => {
        const updatedEtapes = cours.etapes.map(e =>
          e.id === etapeId ? { ...e, ...etape } : e
        );
        return this.coursService.updateCours(coursId, { etapes: updatedEtapes }).pipe(
          map(() => ({ ...cours.etapes.find(e => e.id === etapeId)!, ...etape }))
        );
      })
    );
  }

  // Delete a step
  deleteEtape(coursId: number, etapeId: number): Observable<void> {
    return this.coursService.getCoursWithEtapes(coursId).pipe(
      switchMap(cours => {
        const updatedEtapes = cours.etapes.filter(e => e.id !== etapeId);
        return this.coursService.updateCours(coursId, { etapes: updatedEtapes }).pipe(
          map(() => undefined)
        );
      })
    );
  }

  // Reorder steps for a course
  reorderEtapes(coursId: number, etapes: Etape[]): Observable<Etape[]> {
    return this.coursService.updateCours(coursId, { etapes }).pipe(
      map(() => etapes)
    );
  }

  private generateEtapeId(etapes: Etape[]): number {
    if (etapes.length === 0) return 1;
    const maxId = Math.max(...etapes.map(e => Number(e.id)));
    return maxId + 1;
  }
}