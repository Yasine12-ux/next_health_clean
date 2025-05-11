import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartFemmeComponent } from './pie-chart-femme.component';

describe('PieChartFemmeComponent', () => {
  let component: PieChartFemmeComponent;
  let fixture: ComponentFixture<PieChartFemmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieChartFemmeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PieChartFemmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
