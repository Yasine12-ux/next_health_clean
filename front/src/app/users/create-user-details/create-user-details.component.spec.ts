import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserDetailsComponent } from './create-user-details.component';

describe('UserDetailsComponent', () => {
  let component: CreateUserDetailsComponent;
  let fixture: ComponentFixture<CreateUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUserDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
