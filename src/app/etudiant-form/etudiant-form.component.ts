import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Etudiant } from 'Modeles/Etudiant'; 

@Component({
  selector: 'app-etudiant-form',
  templateUrl: './etudiant-form.component.html',
  styleUrls: ['./etudiant-form.component.scss']
})
export class EtudiantFormComponent implements OnInit {
  etudiant: Etudiant = {
    id: 0,
    NumeroUnique: 0,
    Nom: '',
    Prenom: '',
    email: '',
    password: '',
    niveau: '',
    firebaseUid: '',
    role: ''
  };
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.dataService.getEtudiantById(this.id).subscribe({
      next: (data) => {
        this.etudiant = data;
      },
      error: (err) => {
        console.error('Error fetching etudiant:', err);
      }
    });
  }

  save(): void {
    this.dataService.updateEtudiant(this.etudiant).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error('Error updating etudiant:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}