import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursService } from '../services/course.service';

import { Cours } from 'Modeles/Cours';
import { ComponentsModule } from 'app/components/components.module';

@Component({
  selector: 'app-cours-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,ComponentsModule],
  templateUrl: './cours-form.component.html',
  styleUrls: ['./cours-form.component.scss']
})
export class CoursFormComponent implements OnInit {
  coursForm!: FormGroup;
  isEditMode: boolean = false;
  coursId?: number;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé'];

  constructor(
    private fb: FormBuilder,
    private coursService: CoursService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.determineMode();
  }

  initForm(): void {
    this.coursForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      contenu: ['', [Validators.required, Validators.minLength(10)]],
      niveau: ['Débutant', Validators.required]
    });
  }

  determineMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.isEditMode = false;
    } else {
      this.isEditMode = true;
      this.coursId = Number(id);
      this.loadCours();
    }
  }

  loadCours(): void {
    if (!this.coursId) return;
    
    this.isLoading = true;
    this.coursService.getCoursWithEtapes(this.coursId).subscribe({
      next: (cours) => {
        this.coursForm.patchValue({
          titre: cours.titre,
          contenu: cours.contenu,
          niveau: cours.niveau
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du cours';
        console.error('Error loading course:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.coursForm.invalid) {
      this.coursForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.coursForm.value;

    if (this.isEditMode && this.coursId) {
      this.coursService.updateCours(this.coursId, formValue).subscribe({
        next: (cours) => {
          this.router.navigate(['/cours', cours.id]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la mise à jour du cours';
          console.error('Error updating course:', error);
          this.isSubmitting = false;
        }
      });
    } else {
      this.coursService.createCours(formValue).subscribe({
        next: (cours) => {
          this.router.navigate(['/cours', cours.id]);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la création du cours';
          console.error('Error creating course:', error);
          this.isSubmitting = false;
        }
      });
    }
  }
}