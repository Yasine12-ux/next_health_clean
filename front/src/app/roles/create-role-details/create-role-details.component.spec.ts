import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleDetailsComponent } from './create-role-details.component';

describe('UserDetailsComponent', () => {
  let component: CreateRoleDetailsComponent;
  let fixture: ComponentFixture<CreateRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateRoleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
