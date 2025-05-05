import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationBuilder, AnimationFactory, style, animate } from '@angular/animations';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent {
  @Input() studentName: string = 'Student';
  @Input() courseName: string = 'Course';
  @Input() score: number = 0;
  @Input() totalQuestions: number = 0;
  @Input() passed: boolean = false;
  @Output() close = new EventEmitter<void>();
  
  currentDate: Date = new Date();
  
  constructor() {}
  
  getPassMessage(): string {
    if (this.passed) {
      return 'Congratulations! You\'ve earned your certificate!';
    } else {
      return 'Keep practicing! You can try again.';
    }
  }
  
  closePopup(): void {
    this.close.emit();
  }
  
  getScorePercentage(): number {
    return Math.round((this.score / this.totalQuestions) * 100);
  }
}