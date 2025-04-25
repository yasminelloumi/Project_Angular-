import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../services/course.service';

@Component({
  selector: 'app-course-level',
  templateUrl: './course-level.component.html',
  styleUrls: ['./course-level.component.css']
})
export class CourseLevelComponent implements OnInit {
  courseId: number = 0;
  selectedCourse: any = null;
  levels: any[] = [];

  // Positions ajustées pour correspondre à la ligne pointillée de l'image
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
    console.log('courseId récupéré:', this.courseId);

    this.courseService.getCourses().subscribe((courses: any[]) => {
      console.log('Liste des cours:', courses);
      this.selectedCourse = courses.find(course => Number(course.id) === this.courseId);
      console.log('Cours sélectionné:', this.selectedCourse);

      // Préparer les niveaux 
      this.levels = [];
      for (let i = 0; i < 5; i++) {
        const etape = this.selectedCourse?.etapes[i];
        this.levels.push({
          id: etape?.id || null,
          titre: etape?.titre || `Level ${i + 1}`,
          description: etape?.description || 'Not available yet',
          estComplete: etape?.estComplete || false,
          position: this.buttonPositions[i],
          disabled: !etape // Désactiver si aucune étape n'existe
        });
      }
    });
  }

  goToLevel(level: any): void {
    if (!level.disabled) {
      this.router.navigate([`/cours/${this.courseId}/level/${level.id}`]);
    }
  }
}