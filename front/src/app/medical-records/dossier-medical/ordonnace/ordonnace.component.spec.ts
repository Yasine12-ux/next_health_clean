import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdonnaceComponent } from './ordonnace.component';

describe('OrdonnaceComponent', () => {
  let component: OrdonnaceComponent;
  let fixture: ComponentFixture<OrdonnaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdonnaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdonnaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
