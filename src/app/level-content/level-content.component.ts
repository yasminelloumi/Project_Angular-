import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-level-content',
  template: `
    <div *ngIf="etape" class="level-content">
      <h2>{{ etape.titre }}</h2>
      <p>{{ etape.description }}</p>
      <!-- Ajoutez ici le contenu détaillé du cours -->
    </div>
    <div *ngIf="!etape" class="no-content">
      <p>Niveau non trouvé.</p>
    </div>
  `,
  styles: [
    `
      .level-content {
        padding: 20px;
        text-align: center;
      }
      .no-content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 90vh;
        font-size: 1.5rem;
        color: #333;
      }
    `
  ]
})
export class LevelContentComponent implements OnInit {
  courseId: number = 0;
  levelId: number = 0;
  etape: any = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.levelId = Number(this.route.snapshot.paramMap.get('levelId'));

    this.courseService.getCourses().subscribe((courses: any[]) => {
      const course = courses.find(c => Number(c.id) === this.courseId);
      if (course) {
        this.etape = course.etapes.find((e: any) => Number(e.id) === this.levelId);
      }
    });
  }
}