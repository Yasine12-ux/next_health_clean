import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuresListSelectorItemComponent } from './structures-list-selector-item.component';

describe('StructuresListSelectorItemComponent', () => {
  let component: StructuresListSelectorItemComponent;
  let fixture: ComponentFixture<StructuresListSelectorItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuresListSelectorItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StructuresListSelectorItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
