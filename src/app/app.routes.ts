import { Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AddRecipesComponent } from './components/add-recipes/add-recipes.component';
import { HomeComponent } from './components/home/home.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { DetailListComponent } from './components/detail-list/detail-list.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/home/home.component').then(
                (c) => HomeComponent
            ),
        pathMatch: 'full'
    },
    {
        path: 'about-us',
        loadComponent: () =>
            import('./components/about-us/about-us.component').then(
                (c) => AboutUsComponent
            )
    },
    {
        path: 'add-recipes',
        loadComponent: () =>
            import('./components/add-recipes/add-recipes.component').then(
                (c) => AddRecipesComponent
            )
    },
    {
        path: 'recipes-list',
        loadComponent: () =>
            import('./components/recipes-list/recipes-list.component').then(
                (c) => RecipesListComponent
            )
    },
    {
        path: 'detail-list/:id',
        loadComponent: () =>
            import('./components/detail-list/detail-list.component').then(
                (c) => DetailListComponent
            )
    }

];
