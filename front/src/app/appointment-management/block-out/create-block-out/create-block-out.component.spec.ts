import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBlockOutComponent } from './create-block-out.component';

describe('CreateBlockOutComponent', () => {
  let component: CreateBlockOutComponent;
  let fixture: ComponentFixture<CreateBlockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBlockOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateBlockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
