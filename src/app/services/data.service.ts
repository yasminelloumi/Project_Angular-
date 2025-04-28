import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Etudiant } from 'Modeles/Etudiant'; 
import { Parant } from 'Modeles/Parant'; 
import { EtudiantParant } from 'Modeles/etudiant-parant.interface'; 
import { ChartData } from 'Modeles/chart-data';
import { Cours } from 'Modeles/Cours'; // Added import for Cours


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000';
  private etudiantsUrl = `${this.apiUrl}/Etudiants`;
  private parantsUrl = `${this.apiUrl}/Parant`;

  constructor(private http: HttpClient) {}

  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.etudiantsUrl);
  }

  getAllParants(): Observable<Parant[]> {
    return this.http.get<Parant[]>(this.parantsUrl);
  }

  getEtudiantsWithParants(): Observable<EtudiantParant[]> {
    return forkJoin([this.getAllEtudiants(), this.getAllParants()]).pipe(
      map(([etudiants, parants]) => {
        console.log('Etudiants:', etudiants);
        console.log('Parants:', parants);

        return etudiants.map(etudiant => {
          const parant = parants.find(p => p.NumeroUnique === etudiant.NumeroUnique);
          console.log(`Matching parant for NumeroUnique ${etudiant.NumeroUnique}:`, parant);
          return {
            id: etudiant.id,
            NumeroUnique: etudiant.NumeroUnique,
            Nom: etudiant.Nom,
            Prenom: etudiant.Prenom,
            email: etudiant.email,
            niveau: etudiant.niveau,
            NomParent: parant ? `${parant.Nom} ${parant.Prenom}` : 'N/A',
            EmailParent: parant ? parant.email : 'N/A'
          } as EtudiantParant;
        });
      })
    );
  }

  getEtudiantById(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.etudiantsUrl}/${id}`);
  }

  updateEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.etudiantsUrl}/${etudiant.id}`, etudiant);
  }

  deleteEtudiantById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.etudiantsUrl}/${id}`);
  }

  deleteParantById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.parantsUrl}/${id}`);
  }
  getEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(`${this.apiUrl}/Etudiants`);
  }
  
  getParents(): Observable<Parant[]> {
    return this.http.get<Parant[]>(`${this.apiUrl}/Parant`);
  }
  
  getCours(): Observable<Cours[]> {
    return this.http.get<Cours[]>(`${this.apiUrl}/Cours`);
  }
  
  // Get student distribution by level
  getStudentsByLevel(): Observable<ChartData> {
    return this.getEtudiants().pipe(
      map(etudiants => {
        // Count students by level
        const levelCounts: { [key: string]: number } = {};
        
        etudiants.forEach(etudiant => {
          if (etudiant.niveau) {
            levelCounts[etudiant.niveau] = (levelCounts[etudiant.niveau] || 0) + 1;
          }
        });
        
        // Convert to chart data format
        const labels = Object.keys(levelCounts);
        const data = Object.values(levelCounts);
        
        return {
          labels,
          datasets: [{
            data,
            backgroundColor: [
              '#1976D2', // Primary
              '#7B1FA2', // Secondary
              '#FF9800', // Accent
              '#4CAF50', // Success
              '#FFC107'  // Warning
            ]
          }]
        };
      })
    );
  }
  
  // Get student vs parent counts for comparison
  getStudentParentComparison(): Observable<ChartData> {
    return forkJoin([
      this.getEtudiants(),
      this.getParents()
    ]).pipe(
      map(([etudiants, parents]) => {
        return {
          labels: ['Étudiants', 'Parents'],
          datasets: [{
            data: [etudiants.length, parents.length],
            backgroundColor: ['#1976D2', '#FF9800']
          }]
        };
      })
    );
  }
  
  // Get course distribution
  getCourseStatistics(): Observable<ChartData> {
    return this.getCours().pipe(
      map(courses => {
        return {
          labels: courses.map(course => course.titre),
          datasets: [{
            data: courses.map(course => course.etapes.length),
            backgroundColor: courses.map((_, index) => {
              const colors = ['#1976D2', '#7B1FA2', '#FF9800', '#4CAF50', '#F44336'];
              return colors[index % colors.length];
            })
          }]
        };
      })
    );
  }
  
  // Get course completions (mocked since we don't have real completion data)
  getCourseCompletions(): Observable<ChartData> {
    return this.getCours().pipe(
      map(courses => {
        // For demo purposes, generate random completion percentages
        const getRandomPercentage = () => Math.floor(Math.random() * 100);
        
        return {
          labels: courses.map(course => course.titre),
          datasets: [{
            label: 'Taux de complétion (%)',
            data: courses.map(() => getRandomPercentage()),
            backgroundColor: '#1976D2',
            borderColor: '#1565c0',
            borderWidth: 1
          }]
        };
      })
    );
  }
}
