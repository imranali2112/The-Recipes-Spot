import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RecipesInterface } from 'src/app/interface/recipes-interface';
import { FirebaseService } from 'src/app/service/recipe-service/recipe.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';


@Component({
  selector: 'app-recipes-list',
  imports: [CardModule, ButtonModule, RouterLink, RouterLinkActive,CascadeSelectModule],
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.css'
})
export class RecipesListComponent {
  recipes: RecipesInterface[] = [];
  isLoading = true;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadRecipes();
     
  }

  async loadRecipes() {
    try {
      this.recipes = await this.firebaseService.getAllRecipes();
      console.log('Recipes fetched:', this.recipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
