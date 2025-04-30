import { Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursService } from '../services/course.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Etape } from 'Modeles/Etape';
import { Quiz } from 'Modeles/Quiz';

@Component({
  selector: 'app-level-content',
  templateUrl: './level-content.component.html',
  styleUrls: ['./level-content.component.css']
})
export class LevelContentComponent implements OnInit, OnDestroy, AfterViewInit {
  courseId: string = '';
  levelId: string = '';
  currentLevel: Etape | null = null;
  loading: boolean = true;
  error: string | null = null;

  quizQuestions: Quiz[] = [];
  quizAnswers: string[] = [];
  quizSubmitted: boolean = false;
  quizScore: number = 0;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CoursService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        this.courseId = params.get('id') || '';
        this.levelId = params.get('levelId') || '';

        console.log('Full URL:', this.router.url);
        console.log('Parameters:', {
          courseId: this.courseId,
          levelId: this.levelId,
          typeCourseId: typeof this.courseId,
          typeLevelId: typeof this.levelId
        });

        if (!this.courseId || !this.levelId) {
          this.handleError(`Missing IDs in URL: courseId=${this.courseId}, levelId=${this.levelId}`);
          return;
        }

        this.loadContent();
      })
    );
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges(); // Force change detection after the view is initialized
  }

  loadContent(): void {
    this.loading = true;
    this.error = null;

    this.subscriptions.add(
      this.courseService.getCourses().subscribe({
        next: (courses) => {
          console.log('Received courses:', courses);

          const courseIdNum = Number(this.courseId);
          if (isNaN(courseIdNum)) {
            this.handleError('Invalid course ID');
            return;
          }

          const foundCourse = courses.find(c => c.id === courseIdNum);
          if (!foundCourse) {
            this.handleError('Course not found');
            return;
          }

          const levelIdNum = Number(this.levelId);
          if (isNaN(levelIdNum)) {
            this.handleError('Invalid step ID');
            return;
          }

          this.currentLevel = foundCourse.etapes?.find(
            (e: Etape) => e.id === levelIdNum
          ) || null;

          if (!this.currentLevel) {
            this.handleError('Step not found');
            return;
          }

          if (this.currentLevel.contentType === 'quiz') {
            this.quizQuestions = Array.isArray(this.currentLevel.contentData)
              ? this.currentLevel.contentData
              : [];
            this.quizAnswers = new Array(this.quizQuestions.length).fill('');
            this.quizSubmitted = false;
            this.quizScore = 0;
          }

          console.log('Current level:', this.currentLevel);
          this.loading = false;
          console.log('State after loading:', {
            loading: this.loading,
            error: this.error,
            currentLevel: this.currentLevel,
            condition: !this.loading && !this.error && this.currentLevel
          });

          // Force change detection with a slight delay
          setTimeout(() => {
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => {
          this.handleError(`Load error: ${err.message}`);
        }
      })
    );
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (!url || !url.startsWith('http')) {
      console.warn('Invalid URL for iframe:', url);
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onAnswerSelected(questionIndex: number, option: string): void {
    this.quizAnswers[questionIndex] = option;
  }

  submitQuiz(): void {
    this.quizScore = 0;
    this.quizQuestions.forEach((question, index) => {
      if (this.quizAnswers[index] === question.correctAnswer) {
        this.quizScore++;
      }
    });
    this.quizSubmitted = true;
    this.cdr.detectChanges();
  }

  goToNextLevel(): void {
    this.subscriptions.add(
      this.courseService.getCourses().subscribe(courses => {
        const courseIdNum = Number(this.courseId);
        if (isNaN(courseIdNum)) {
          this.handleError('Invalid course ID');
          return;
        }

        const course = courses.find(c => c.id === courseIdNum);
        if (!course) {
          this.handleError('Course not found');
          return;
        }

        const levelIdNum = Number(this.levelId);
        if (isNaN(levelIdNum)) {
          this.handleError('Invalid step ID');
          return;
        }

        const currentIndex = course.etapes.findIndex(
          (e: Etape) => e.id === levelIdNum
        );
        const nextLevel = course.etapes[currentIndex + 1];

        if (nextLevel) {
          this.router.navigate([`/course/${this.courseId}/level/${nextLevel.id}`]);
        } else {
          this.router.navigate([`/course/${this.courseId}`]);
        }
      })
    );
  }

  private handleError(message: string): void {
    this.error = message;
    this.loading = false;
    console.error(message);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}