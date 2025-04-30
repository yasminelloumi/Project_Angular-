import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../services/course.service';

import { Cours } from 'Modeles/Cours';
import { ComponentsModule } from 'app/components/components.module';


@Component({
  selector: 'app-cours-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ComponentsModule],
  templateUrl: './cours-list.component.html',
  styleUrls: ['./cours-list.component.scss']
})
export class CoursListComponent implements OnInit {
  cours: Cours[] = [];
  filteredCours: Cours[] = [];
  searchTerm: string = '';
  selectedNiveau: string = '';
  niveaux: string[] = ['Débutant', 'Intermédiaire', 'Avancé'];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private coursService: CoursService) {}

  ngOnInit(): void {
    this.loadCours();
  }

  loadCours(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.coursService.getAllCours().subscribe({
      next: (data) => {
        this.cours = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des cours. Veuillez réessayer plus tard.';
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredCours = this.cours.filter(cours => {
      const matchesSearch =
        !this.searchTerm ||
        cours.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cours.contenu.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesNiveau =
        !this.selectedNiveau || cours.niveau === this.selectedNiveau;
      
      return matchesSearch && matchesNiveau;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onNiveauChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedNiveau = '';
    this.applyFilters();
  }

  deleteCours(id: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action supprimera également toutes les étapes associées.')) {
      this.isLoading = true; // Show loading state during deletion
      this.errorMessage = '';
      this.coursService.deleteCours(id).subscribe({
        next: () => {
          this.cours = this.cours.filter(c => c.id !== id);
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du cours. Veuillez réessayer.';
          console.error('Error deleting course:', error);
          this.isLoading = false;
        }
      });
    }
  }
}