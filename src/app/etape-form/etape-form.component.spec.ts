import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeFormComponent } from './etape-form.component';

describe('EtapeFormComponent', () => {
  let component: EtapeFormComponent;
  let fixture: ComponentFixture<EtapeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtapeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtapeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
