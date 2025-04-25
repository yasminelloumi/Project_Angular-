import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursService } from '../services/course.service';
import { EtapeService } from '../services/etape.service';
import { Cours } from 'Modeles/Cours';
import { Etape } from 'Modeles/Etape';
import { ComponentsModule } from 'app/components/components.module';

@Component({
  selector: 'app-etape-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,ComponentsModule],
  templateUrl: './etape-form.component.html',
  styleUrls: ['./etape-form.component.scss']
})
export class EtapeFormComponent implements OnInit {
  etapeForm!: FormGroup;
  isEditMode: boolean = false;
  etapeId?: number;
  coursId?: number;
  cours?: Cours;
  existingEtapes: Etape[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private etapeService: EtapeService,
    private coursService: CoursService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCoursId();
    this.determineMode();
  }

  initForm(): void {
    this.etapeForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      ordre: [1, [Validators.required, Validators.min(1)]],
      estComplete: [false]
    });
  }

  loadCoursId(): void {
    this.coursId = Number(this.route.snapshot.paramMap.get('coursId'));
    if (isNaN(this.coursId)) {
      this.errorMessage = 'ID de cours invalide';
      return;
    }

    this.isLoading = true;
    this.coursService.getCoursWithEtapes(this.coursId).subscribe({
      next: (cours) => {
        this.cours = cours;
        this.existingEtapes = cours.etapes || [];
        
        // Set default order to next position if creating new step
        if (!this.isEditMode) {
          const nextOrder = this.existingEtapes.length > 0
            ? Math.max(...this.existingEtapes.map(e => e.ordre)) + 1
            : 1;
          this.etapeForm.get('ordre')?.setValue(nextOrder);
        }
        
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du cours';
        console.error('Error loading course:', error);
        this.isLoading = false;
      }
    });
  }

  determineMode(): void {
    const id = this.route.snapshot.paramMap.get('etapeId');
    if (id === 'new') {
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
      this.etapeId = Number(id);
      this.loadEtape();
    }
  }

  loadEtape(): void {
    if (!this.etapeId) return;
    
    this.isLoading = true;
    this.etapeService.getEtape(this.etapeId).subscribe({
      next: (etape) => {
        this.etapeForm.patchValue({
          titre: etape.titre,
          contenu: etape.description,
          ordre: etape.ordre,
          estComplete: etape.estComplete
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'étape';
        console.error('Error loading step:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.etapeForm.invalid) {
      this.etapeForm.markAllAsTouched();
      return;
    }

    if (!this.coursId) {
      this.errorMessage = 'ID de cours manquant';
      return;
    }

    this.isSubmitting = true;
    const formValue = {
      ...this.etapeForm.value,
      coursId: this.coursId
    };

    if (this.isEditMode && this.etapeId) {
      this.etapeService.updateEtape(this.etapeId, formValue).subscribe({
        next: () => {
          this.router.navigate(['/cours', this.coursId]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour de l\'étape';
          console.error('Error updating step:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.etapeService.createEtape(formValue).subscribe({
        next: () => {
          this.router.navigate(['/cours', this.coursId]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création de l\'étape';
          console.error('Error creating step:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}