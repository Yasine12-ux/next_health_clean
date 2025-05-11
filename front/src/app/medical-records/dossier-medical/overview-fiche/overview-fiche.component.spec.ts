import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewFicheComponent } from './overview-fiche.component';

describe('OverviewFicheComponent', () => {
  let component: OverviewFicheComponent;
  let fixture: ComponentFixture<OverviewFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewFicheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
