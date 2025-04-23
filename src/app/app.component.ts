import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component"; 
import { TranslationService } from './service/translat/translation.service';
import { DetailListComponent } from "./components/detail-list/detail-list.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'The-Recipes-Spot';

  languages: any[] = [];
  selectedLanguage: any;

  constructor(protected translationService: TranslationService) {
    this.languages = this.translationService.getLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }

  changeLanguage(code: string): void {
    this.translationService.changeLanguage(code);
    this.selectedLanguage = this.translationService.getCurrentLanguage();
  }
}
