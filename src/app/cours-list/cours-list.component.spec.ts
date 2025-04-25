import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursListComponent } from './cours-list.component';

describe('CoursListComponent', () => {
  let component: CoursListComponent;
  let fixture: ComponentFixture<CoursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
