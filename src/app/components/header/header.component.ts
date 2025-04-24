import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { TranslationService } from '../../service/translat/translation.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, DropdownModule, TranslateModule, FormsModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  languages: any[] = [];
  selectedLanguage: any;
   

  ngOnInit(): void {
    this.languages = this.translationService.getLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();

    const darkMode = localStorage.getItem('darkMode') === 'true';
    const element = document.querySelector('html');
    if (element && darkMode) {
      element.classList.add('my-app-dark');
    }
  }

  constructor(public translationService: TranslationService) { }
  onSelectLanguage(event: any): void {
    const selectedCode = event.value.code;
    this.translationService.changeLanguage(selectedCode);
    this.selectedLanguage = this.translationService.getCurrentLanguage();
    document.documentElement.lang = selectedCode;
    document.documentElement.dir = selectedCode === 'ur' ? 'rtl' : 'ltr';

  }
   
}
