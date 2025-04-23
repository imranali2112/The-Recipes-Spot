import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../../service/recipe-service/recipe.service';
import { RecipesInterface } from '../../interface/recipes-interface';
import { CascadeSelectModule } from 'primeng/cascadeselect';

@Component({
  selector: 'app-detail-list',
  imports: [CascadeSelectModule],
  templateUrl: './detail-list.component.html',
  styleUrl: './detail-list.component.css'
})
export class DetailListComponent {
  recipe: RecipesInterface | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseService.getRecipeById(id).then((data) => {
        this.recipe = data;
        this.loading = false;
      }).catch((error) => {
        console.error(error);
        this.loading = false;
      });
    }
  }

    formatText(content: string): string {
    const lines = content.trim().split('\n');
  
    // Check if it's a numbered or lettered list (e.g., 1., a.)
    const isNumberedList = lines.every(line => /^\s*(\d+\.|[a-zA-Z]\.)\s+/.test(line));
  
    if (isNumberedList) {
      // For numbered or lettered list, use <ol> and remove the numbers/letters
      return `<ol class="list-decimal pl-6">${lines.map(line => `<li>${line.replace(/^\s*(\d+\.|[a-zA-Z]\.)\s+/, '')}</li>`).join('')}</ol>`;
    }
  
    // Otherwise, treat each line as a paragraph
    return lines.map(line => `<p class="mb-2">${line}</p>`).join('');
  }

}
 
