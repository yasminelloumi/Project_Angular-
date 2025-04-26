import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../services/course.service';

import { Cours } from 'Modeles/Cours';


interface Level {
  id: number | null;
  titre: string;
  description: string;
  estComplete: boolean;
  position: { top: string; left: string };
  disabled: boolean;
}

@Component({
  selector: 'app-course-level',
  templateUrl: './course-level.component.html',
  styleUrls: ['./course-level.component.css']
})
export class CourseLevelComponent implements OnInit {
  courseId: number = 0;
  selectedCourse: Cours | null = null;
  levels: Level[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Positions for buttons (matching map3.png)
  buttonPositions = [
    { top: '65%', left: '80%' },
    { top: '45%', left: '67%' },
    { top: '22%', left: '55%' },
    { top: '39%', left: '46%' },
    { top: '49%', left: '25%' }
  ];

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
  }

  loadCourse(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.courseService.getCoursWithEtapes(this.courseId).subscribe({
      next: (course) => {
        this.selectedCourse = course;
        this.initializeLevels();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du cours. Veuillez réessayer.';
        console.error('Error loading course:', error);
        this.isLoading = false;
        this.selectedCourse = null;
      }
    });
  }

  initializeLevels(): void {
    this.levels = [];
    const etapes = this.selectedCourse?.etapes || [];
    for (let i = 0; i < 5; i++) {
      const etape = etapes[i];
      this.levels.push({
        id: etape?.id || null,
        titre: etape?.titre || `Niveau ${i + 1}`,
        description: etape?.description || 'Non disponible pour le moment',
        estComplete: etape?.estComplete || false,
        position: this.buttonPositions[i],
        disabled: !etape // Disable if no etape exists
      });
    }
  }

  goToLevel(level: Level): void {
    if (!level.disabled && level.id !== null) {
      this.router.navigate([`/cours/${this.courseId}/level/${level.id}`]);
    }
  }
}