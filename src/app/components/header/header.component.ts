import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { TranslationService } from '../../service/translat/translation.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, DropdownModule, TranslateModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  languages: any[] = [];
  selectedLanguage: any;

  ngOnInit(): void {
    this.languages = this.translationService.getLanguages();
    this.selectedLanguage = this.translationService.getCurrentLanguage();
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
