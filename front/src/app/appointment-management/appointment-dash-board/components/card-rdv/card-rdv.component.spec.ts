import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRDVComponent } from './card-rdv.component';

describe('CardRDVComponent', () => {
  let component: CardRDVComponent;
  let fixture: ComponentFixture<CardRDVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardRDVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardRDVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
