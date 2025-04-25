// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CoursService } from '../services/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  courses: any[] = [];

  constructor(private courseService: CoursService) {}

  ngOnInit() {
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe(
      (data) => {
        this.courses = data;
        console.log('Courses loaded:', this.courses);
      },
      (error) => {
        console.error('Error loading courses:', error);
      }
    );
  }

  onStartCourse() {
    const audio = new Audio('assets/img/click.mp3');
    audio.play();
    console.log('Super ! Tu as commencé un nouveau cours ! 🎉');
  }
}