import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursService } from '../services/course.service';

@Component({
  selector: 'app-course-level',
  templateUrl: './course-level.component.html',
  styleUrls: ['./course-level.component.css']
})
export class CourseLevelComponent implements OnInit {
  courseId: number = 0;
  selectedCourse: any = null;

  constructor(private route: ActivatedRoute, private courseService: CoursService) {}

  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('courseId récupéré:', this.courseId); 
  
    this.courseService.getCourses().subscribe((courses: any[]) => {
      console.log('Liste des cours:', courses); 
      this.selectedCourse = courses.find(course => Number(course.id) === this.courseId);

      console.log('Cours sélectionné:', this.selectedCourse);
    });
  }
  
}
