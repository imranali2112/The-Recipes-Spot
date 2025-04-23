import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  supportedLanguages = [
    { name: 'English', code: 'en' },
    { name: 'Urdu', code: 'ur' }
  ];

  currentLanguage = { name: 'English', code: 'en' };

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.currentLanguage.code);
    this.translate.use(this.currentLanguage.code);
  }

  getLanguages() {
    return this.supportedLanguages;
  }

  changeLanguage(langCode: string) {
    const selectedLang = this.supportedLanguages.find(l => l.code === langCode);
    if (selectedLang) {
      this.currentLanguage = selectedLang;
      this.translate.use(langCode);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }
}
