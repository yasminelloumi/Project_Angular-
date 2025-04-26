import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursService } from '../services/course.service';
import { EtapeService } from '../services/etape.service';
import { Cours } from 'Modeles/Cours';
import { Etape } from 'Modeles/Etape';
import { ComponentsModule } from 'app/components/components.module';


import { map } from 'rxjs/operators';

@Component({
  selector: 'app-etape-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, ComponentsModule],
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
  contentTypes: string[] = ['video', 'text', 'quiz'];

  constructor(
    private fb: FormBuilder,
    private etapeService: EtapeService,
    private coursService: CoursService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCoursId();
    this.determineMode();
  }

  initForm(): void {
    this.etapeForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      ordre: [1, [Validators.required, Validators.min(1)]],
      estComplete: [false],
      contentType: ['text', Validators.required],
      contentData: ['']
    });
  }

  loadCoursId(): void {
    const coursIdParam = this.route.snapshot.paramMap.get('coursId');
    this.coursId = coursIdParam ? Number(coursIdParam) : undefined;
    if (!this.coursId || isNaN(this.coursId)) {
      this.errorMessage = 'ID de cours invalide. Veuillez retourner à la liste des cours.';
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.coursService.getCoursWithEtapes(this.coursId).subscribe({
      next: (cours) => {
        this.cours = cours;
        this.existingEtapes = cours.etapes || [];
        if (!this.isEditMode) {
          const nextOrder = this.existingEtapes.length > 0
            ? Math.max(...this.existingEtapes.map(e => e.ordre)) + 1
            : 1;
          this.etapeForm.get('ordre')?.setValue(nextOrder);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du cours. Veuillez réessayer.';
        console.error('Error loading course:', error);
        this.isLoading = false;
      }
    });
  }

  determineMode(): void {
    const etapeIdParam = this.route.snapshot.paramMap.get('etapeId');
    if (etapeIdParam === 'new') {
      this.isEditMode = false;
    } else if (etapeIdParam) {
      this.etapeId = Number(etapeIdParam);
      if (isNaN(this.etapeId)) {
        this.errorMessage = 'ID d\'étape invalide. Veuillez sélectionner une étape valide.';
        this.isLoading = false;
        return;
      }
      this.isEditMode = true;
      this.loadEtape();
    } else {
      this.errorMessage = 'Aucun ID d\'étape fourni. Veuillez utiliser "Nouvelle étape" ou sélectionner une étape.';
      this.isLoading = false;
      this.router.navigate(['/cours', this.coursId || ''], { replaceUrl: true }); // Redirect to course
    }
  }

  loadEtape(): void {
    if (!this.coursId || !this.etapeId) {
      this.errorMessage = 'ID de cours ou d\'étape manquant. Veuillez réessayer.';
      return;
    }

    this.isLoading = true;
    this.etapeService.getEtape(this.coursId, this.etapeId).subscribe({
      next: (etape) => {
        this.etapeForm.patchValue({
          titre: etape.titre,
          description: etape.description,
          ordre: etape.ordre,
          estComplete: etape.estComplete,
          contentType: etape.contentType,
          contentData: etape.contentData
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de l\'étape. Veuillez réessayer.';
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
      this.errorMessage = 'ID de cours manquant. Veuillez réessayer.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    const formValue = this.etapeForm.value;

    if (this.isEditMode && this.etapeId) {
      this.etapeService.updateEtape(this.coursId, this.etapeId, formValue).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/cours', this.coursId]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour de l\'étape.';
          console.error('Error updating step:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.etapeService.createEtape(this.coursId, formValue).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/cours', this.coursId]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création de l\'étape.';
          console.error('Error creating step:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}