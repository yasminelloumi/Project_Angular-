import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapeDetailComponent } from './etape-detail.component';

describe('EtapeDetailComponent', () => {
  let component: EtapeDetailComponent;
  let fixture: ComponentFixture<EtapeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ EtapeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtapeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
