import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDetailsComponent } from './edit-user-details.component';

describe('UserDetailsComponent', () => {
  let component: EditUserDetailsComponent;
  let fixture: ComponentFixture<EditUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
