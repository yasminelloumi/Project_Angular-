import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Etudiant } from 'Modeles/Etudiant'; 
import { Parant } from 'Modeles/Parant'; 
import { EtudiantParant } from 'Modeles/etudiant-parant.interface'; 


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private etudiantsUrl = 'http://localhost:3000/Etudiants';
  private parantsUrl = 'http://localhost:3000/Parant';

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
}