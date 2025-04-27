import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Quiz, QuizQuestion } from 'Modeles/Quiz';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quiz-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quiz-editor.component.html',
  styleUrls: ['./quiz-editor.component.scss']
})
export class QuizEditorComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  
  quizForm!: FormGroup;
  quizData: Quiz = { questions: [] };
  questionTypes = ['multiple-choice', 'true-false'];
  private subscriptions: Subscription = new Subscription();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initQuizForm();

    try {
      // Parse existing quiz data if available
      if (this.parentForm.get('contentData')?.value) {
        const data = JSON.parse(this.parentForm.get('contentData')?.value);
        if (data && data.questions) {
          this.quizData = data;
          this.loadQuizData();
        }
      }
    } catch (e) {
      console.error('Error parsing quiz data', e);
    }

    // Subscribe to form changes to update parent form
    this.subscriptions.add(
      this.quizForm.valueChanges.subscribe(value => {
        this.parentForm.get('contentData')?.setValue(JSON.stringify(value));
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initQuizForm(): void {
    this.quizForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  loadQuizData(): void {
    const questionsFormArray = this.quizForm.get('questions') as FormArray;
    
    // Clear existing form array
    while (questionsFormArray.length) {
      questionsFormArray.removeAt(0);
    }
    
    // Add each question to form array
    this.quizData.questions.forEach(question => {
      const questionForm = this.createQuestionForm();
      questionForm.patchValue({
        id: question.id,
        text: question.text,
        type: question.type
      });
      
      // Clear options array and add each option
      const optionsArray = questionForm.get('options') as FormArray;
      while (optionsArray.length) {
        optionsArray.removeAt(0);
      }
      
      question.options.forEach(option => {
        const optionForm = this.createOptionForm();
        optionForm.patchValue({
          id: option.id,
          text: option.text,
          isCorrect: option.isCorrect
        });
        optionsArray.push(optionForm);
      });
      
      questionsFormArray.push(questionForm);
    });
  }

  createQuestionForm(): FormGroup {
    return this.fb.group({
      id: [Date.now()],
      text: ['', [Validators.required, Validators.minLength(5)]],
      type: ['multiple-choice', Validators.required],
      options: this.fb.array([this.createOptionForm(), this.createOptionForm()])
    });
  }

  createOptionForm(): FormGroup {
    return this.fb.group({
      id: [Date.now()],
      text: ['', Validators.required],
      isCorrect: [false]
    });
  }

  getOptionsForQuestion(questionIndex: number): FormArray {
    return (this.questions.at(questionIndex) as FormGroup).get('options') as FormArray;
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionForm());
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  addOption(questionIndex: number): void {
    const options = this.getOptionsForQuestion(questionIndex);
    options.push(this.createOptionForm());
  }

  removeOption(questionIndex: number, optionIndex: number): void {
    const options = this.getOptionsForQuestion(questionIndex);
    if (options.length > 2) {
      options.removeAt(optionIndex);
    }
  }

  onQuestionTypeChange(questionIndex: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const questionType = selectElement.value;
    const options = this.getOptionsForQuestion(questionIndex);
    
    if (questionType === 'true-false') {
      // For true-false, ensure exactly 2 options for "True" and "False"
      while (options.length > 0) {
        options.removeAt(0);
      }
      
      const trueOption = this.createOptionForm();
      trueOption.patchValue({
        id: Date.now(),
        text: 'Vrai',
        isCorrect: false
      });
      
      const falseOption = this.createOptionForm();
      falseOption.patchValue({
        id: Date.now() + 1,
        text: 'Faux',
        isCorrect: false
      });
      
      options.push(trueOption);
      options.push(falseOption);
    }
  }
}