import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../services/course.service';
import { EtapeService } from '../services/etape.service';
import { Cours } from 'Modeles/Cours';
import { Etape } from 'Modeles/Etape';
import { ComponentsModule } from 'app/components/components.module';



@Component({
  selector: 'app-cours-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ComponentsModule],
  templateUrl: './cours-detail.component.html',
  styleUrls: ['./cours-detail.component.scss']
})
export class CoursDetailComponent implements OnInit {
  cours?: Cours;
  etapes: Etape[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coursService: CoursService,
    private etapeService: EtapeService
  ) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.errorMessage = 'ID de cours invalide';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.coursService.getCoursWithEtapes(id).subscribe({
      next: (data) => {
        this.cours = data;
        this.etapes = data.etapes || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du cours';
        console.error('Error loading course:', error);
        this.isLoading = false;
      }
    });
  }

  deleteEtape(etapeId: number): void {
    if (!this.cours?.id) {
      this.errorMessage = 'ID de cours manquant';
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) {
      this.etapeService.deleteEtape(this.cours.id, etapeId).subscribe({
        next: () => {
          this.etapes = this.etapes.filter(e => e.id !== etapeId);
        },
        error: (error) => {
          console.error('Error deleting step:', error);
          this.errorMessage = 'Erreur lors de la suppression de l\'étape';
        }
      });
    }
  }

  deleteCours(): void {
    if (!this.cours?.id) {
      this.errorMessage = 'ID de cours manquant';
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours et toutes ses étapes ?')) {
      this.coursService.deleteCours(this.cours.id).subscribe({
        next: () => {
          this.router.navigate(['/cours']);
        },
        error: (error) => {
          console.error('Error deleting course:', error);
          this.errorMessage = 'Erreur lors de la suppression du cours';
        }
      });
    }
  }

  toggleEtapeCompletion(etape: Etape): void {
    if (!this.cours?.id) {
      this.errorMessage = 'ID de cours manquant';
      return;
    }
    const updatedData = { estComplete: !etape.estComplete };
    this.etapeService.updateEtape(this.cours.id, etape.id, updatedData).subscribe({
      next: (updated) => {
        const index = this.etapes.findIndex(e => e.id === etape.id);
        if (index !== -1) {
          this.etapes[index] = updated;
        }
      },
      error: (error) => {
        console.error('Error updating step completion:', error);
        this.errorMessage = 'Erreur lors de la mise à jour de l\'étape';
      }
    });
  }
  debugNavigation(id: number): void {
    console.log('Navigating to add step for course ID:', id);
  }
  
}