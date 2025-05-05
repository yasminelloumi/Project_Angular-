import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeService } from '../services/etape.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Etape } from 'Modeles/Etape';
import { QuizQuestion, QuizOption } from 'Modeles/Quiz';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { environment } from '../../environments/environment';
import { CertificateComponent } from 'app/certificate/certificate.component';


@Component({
  selector: 'app-level-content',
  standalone: true,
  imports: [CommonModule, RouterModule, ComponentsModule, CertificateComponent],
  templateUrl: './level-content.component.html',
  styleUrls: ['./level-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LevelContentComponent implements OnInit, OnDestroy {
  coursId?: number;
  etapeId?: number;
  etape: Etape | null = null;
  isLoading = true;
  errorMessage = '';

  quizQuestions: QuizQuestion[] = [];
  quizAnswers: (string | null)[] = [];
  quizSubmitted = false;
  quizScore = 0;
  quizPassed = false;
  showCertificate = false;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private etapeService: EtapeService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.route.params.subscribe(() => {
        this.loadEtape();
      })
    );
  }
  

  goToCourses(): void {
    console.log('goToCourses called');
    this.router.navigate([`/Cours/${this.coursId}`]);
  }

  goToCourseMenu(): void {
    if (this.coursId) {
      this.router.navigate([`/course/${this.coursId}`]);
    } else {
      this.router.navigate(['/Cours']);
    }
  }

  loadEtape(): void {
    const coursIdParam = this.route.snapshot.paramMap.get('coursId');
    const etapeIdParam = this.route.snapshot.paramMap.get('etapeId');

    this.coursId = coursIdParam ? Number(coursIdParam) : undefined;
    this.etapeId = etapeIdParam ? Number(etapeIdParam) : undefined;

    if (
      !this.coursId ||
      !this.etapeId ||
      isNaN(this.coursId) ||
      isNaN(this.etapeId) ||
      this.coursId <= 0 ||
      this.etapeId <= 0
    ) {
      this.handleError('Invalid course or level ID. Please check the URL.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.quizSubmitted = false;
    this.quizScore = 0;
    this.quizPassed = false;
    this.showCertificate = false;

    this.subscriptions.add(
      this.etapeService.getEtape(this.coursId, this.etapeId).subscribe({
        next: (etape) => {
          this.etape = etape;

          if (etape.contentType === 'quiz') {
            let quizData = etape.contentData;
            if (typeof quizData === 'string') {
              try {
                const parsedData = JSON.parse(quizData);
                quizData = parsedData.questions || [];
              } catch (e) {
                this.handleError('Invalid quiz data format.');
                return;
              }
            }
            this.quizQuestions = this.normalizeQuizData(quizData);
            this.quizAnswers = new Array(this.quizQuestions.length).fill(null);
          }

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.handleError(
            err.status === 404
              ? `Level or course not found (Course ID: ${this.coursId}, Level ID: ${this.etapeId})`
              : 'Error loading level.'
          );
        }
      })
    );
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
    if (!environment.production) {
      console.error(message);
    }
    this.cdr.markForCheck();
  }

  private normalizeQuizData(quizData: any): QuizQuestion[] {
    if (!Array.isArray(quizData)) {
      this.handleError('Quiz data is not an array.');
      return [];
    }

    return quizData.map((q: any, index: number) => {
      if ('id' in q && 'text' in q && 'type' in q && 'options' in q) {
        return {
          id: q.id,
          text: q.text,
          type: q.type as 'multiple-choice' | 'true-false',
          options: q.options.map((opt: any) => ({
            id: opt.id || Math.random(),
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        };
      }

      if ('question' in q && 'options' in q && 'correctAnswer' in q) {
        return {
          id: index + 1,
          text: q.question,
          type: 'multiple-choice',
          options: q.options.map((opt: string, optIndex: number) => ({
            id: optIndex + 1,
            text: opt,
            isCorrect: opt === q.correctAnswer
          }))
        };
      }

      this.handleError(`Unexpected quiz question format at index ${index}.`);
      return {
        id: index + 1,
        text: 'Invalid question',
        type: 'multiple-choice',
        options: []
      };
    });
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (!url || !url.startsWith('http')) {
      this.handleError('Invalid video URL.');
      return this.sanitizer.bypassSecurityTrustResourceUrl('');
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onAnswerSelected(questionIndex: number, optionText: string): void {
    this.quizAnswers[questionIndex] = optionText;
    this.cdr.markForCheck();
  }

  submitQuiz(): void {
    console.log('submitQuiz called');
    this.quizScore = 0;
    this.quizQuestions.forEach((question, index) => {
      const selectedAnswer = this.quizAnswers[index];
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && selectedAnswer === correctOption.text) {
        this.quizScore++;
      }
    });
    
    this.quizSubmitted = true;
    this.quizPassed = this.quizScore >= (this.quizQuestions.length / 2);
    
    // Show certificate popup after a short delay
    setTimeout(() => {
      this.showCertificate = true;
      this.cdr.markForCheck();
    }, 1000);
    
    this.cdr.markForCheck();
  }

  closeCertificate(): void {
    this.showCertificate = false;
    this.cdr.markForCheck();
  }

  goToNextLevel(): void {
    console.log('goToNextLevel called');
    if (!this.coursId || !this.etapeId) {
      this.handleError('Invalid course or level ID.');
      return;
    }

    this.subscriptions.add(
      this.etapeService.getEtapesByCours(this.coursId).subscribe({
        next: (etapes) => {
          const currentIndex = etapes.findIndex(e => e.id === this.etapeId);
          const nextLevel = etapes[currentIndex + 1];

          if (nextLevel) {
            this.router.navigate([`/course/${this.coursId}/level/${nextLevel.id}`]);
          } else {
            this.router.navigate([`/course/${this.coursId}`]);
          }
        },
        error: (err) => {
          this.handleError('Error navigating to next level.');
        }
      })
    );
  }

  retryLoad(): void {
    this.loadEtape();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}