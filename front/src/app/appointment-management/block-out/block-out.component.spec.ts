import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockOutComponent } from './block-out.component';

describe('BlockOutComponent', () => {
  let component: BlockOutComponent;
  let fixture: ComponentFixture<BlockOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlockOutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlockOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
