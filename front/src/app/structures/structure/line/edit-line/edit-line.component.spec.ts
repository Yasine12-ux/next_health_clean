import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLineComponent } from './edit-line.component';

describe('EditLineComponent', () => {
  let component: EditLineComponent;
  let fixture: ComponentFixture<EditLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
