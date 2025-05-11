import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuresListSelectorComponent } from './structures-list-selector.component';

describe('StructuresListSelectorComponent', () => {
  let component: StructuresListSelectorComponent;
  let fixture: ComponentFixture<StructuresListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StructuresListSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StructuresListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
