import { Component, NgModule } from '@angular/core'; 
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { FirebaseService } from 'src/app/service/recipe-service/recipe.service';
import { RecipesInterface } from 'src/app/interface/recipes-interface';
import { CardModule } from 'primeng/card'; 
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CascadeSelectModule } from 'primeng/cascadeselect';



@Component({
  selector: 'app-home',
  imports: [CarouselModule, ButtonModule, CardModule, RouterLink, RouterLinkActive, CascadeSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentIndex = 0;
  featuredRecipes: RecipesInterface[] = [];

  constructor(private firebaseService: FirebaseService) {}

  banner = [
       
    {img: 'assets/images/ban.jpg'},   
    {img: 'assets/images/about.jpg'},   
    {img: 'assets/images/nar.jpg'},   
     
  ];

  ngOnInit(): void{
    setInterval(() => {
      this.nextSlid()
    }, 5000);
    this.loadFeaturedRecipes();
  }

  nextSlid():void{
    this.currentIndex = (this.currentIndex + 1) % this.banner.length;
  }

  previouSlid(): void{
    this.currentIndex = (this.currentIndex -1 + this.banner.length) % this.banner.length;
  }

  async loadFeaturedRecipes() {
    this.featuredRecipes = await this.firebaseService.getLimitedRecipes(4);
  }
}
