import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EtapeService } from '../services/etape.service';
import { Etape } from 'Modeles/Etape';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-etape-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ComponentsModule],
  templateUrl: './etape-detail.component.html',
  styleUrls: ['./etape-detail.component.scss']
})
export class EtapeDetailComponent implements OnInit {
  etape?: Etape;
  coursId?: number;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etapeService: EtapeService
  ) {}

  ngOnInit(): void {
    this.loadEtape();
  }

  loadEtape(): void {
    const coursId = Number(this.route.snapshot.paramMap.get('coursId'));
    const etapeId = Number(this.route.snapshot.paramMap.get('etapeId'));

    if (isNaN(coursId) || isNaN(etapeId)) {
      this.errorMessage = 'ID de cours ou d\'étape invalide';
      this.isLoading = false;
      return;
    }

    this.coursId = coursId;
    this.etapeService.getEtape(coursId, etapeId).subscribe({
      next: (etape) => {
        this.etape = etape;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'étape';
        console.error('Error loading step:', error);
        this.isLoading = false;
      }
    });
  }

  toggleCompletion(): void {
    if (!this.coursId || !this.etape) {
      this.errorMessage = 'ID de cours ou étape manquant';
      return;
    }

    const updatedData = { estComplete: !this.etape.estComplete };
    this.etapeService.updateEtape(this.coursId, this.etape.id, updatedData).subscribe({
      next: (updated) => {
        this.etape = updated;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour de l\'étape';
        console.error('Error updating step:', error);
      }
    });
  }

  deleteEtape(): void {
    if (!this.coursId || !this.etape) {
      this.errorMessage = 'ID de cours ou étape manquant';
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer cette étape ?')) {
      this.etapeService.deleteEtape(this.coursId, this.etape.id).subscribe({
        next: () => {
          this.router.navigate(['/cours', this.coursId]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'étape';
          console.error('Error deleting step:', error);
        }
      });
    }
  }
}