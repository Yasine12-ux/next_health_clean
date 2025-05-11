import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRoleDetailsComponent } from './edit-role-details.component';

describe('UserDetailsComponent', () => {
  let component: EditRoleDetailsComponent;
  let fixture: ComponentFixture<EditRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditRoleDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
