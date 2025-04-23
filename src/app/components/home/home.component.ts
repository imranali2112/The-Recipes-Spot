import { Component, NgModule } from '@angular/core'; 
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentIndex = 0;

  banner = [
       
    {img: 'assets/images/ban.jpg'},   
    {img: 'assets/images/about.jpg'},   
    {img: 'assets/images/nar.jpg'},   
     
  ];

  ngOnInit(): void{
    setInterval(() => {
      this.nextSlid()
    }, 5000);
  }

  nextSlid():void{
    this.currentIndex = (this.currentIndex + 1) % this.banner.length;
  }

  previouSlid(): void{
    this.currentIndex = (this.currentIndex -1 + this.banner.length) % this.banner.length;
  }
}
