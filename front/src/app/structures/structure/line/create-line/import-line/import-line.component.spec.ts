import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLineComponent } from './import-line.component';

describe('ImportLineComponent', () => {
  let component: ImportLineComponent;
  let fixture: ComponentFixture<ImportLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportLineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
