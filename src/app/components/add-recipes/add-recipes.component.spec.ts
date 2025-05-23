import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipesComponent } from './add-recipes.component';

describe('AddRecipesComponent', () => {
  let component: AddRecipesComponent;
  let fixture: ComponentFixture<AddRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRecipesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
