import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLineComponent } from './create-line.component';

describe('CreateLineComponent', () => {
  let component: CreateLineComponent;
  let fixture: ComponentFixture<CreateLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
