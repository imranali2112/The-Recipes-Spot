import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { RecipesInterface } from '../../interface/recipes-interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FirebaseService } from '../../service/recipe-service/recipe.service';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-recipes',
  standalone: true,
  imports: [
    ImageModule,
    HttpClientModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TextareaModule,
    InputGroupAddonModule,
    InputGroupModule,
    FileUploadModule,
    ButtonModule,
    SelectButtonModule,
    SelectModule,
  ],
  providers: [FirebaseService, MessageService],
  templateUrl: './add-recipes.component.html',
  styleUrls: ['./add-recipes.component.css']
})
export class AddRecipesComponent implements OnInit {
  recipeForm!: FormGroup;
  imageFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  imageError = false;
  isLoading = true;

  categories = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Dessert', value: 'dessert' },
  ];

  constructor(
    private firebaseService: FirebaseService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.recipeForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      ingredients: new FormControl('', Validators.required),
      cooking_instructions: new FormControl('', Validators.required),
    });
  }

  onFileSelected(event: any) {
    const file = event.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        this.imageError = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please upload an image file'
        });
        return;
      }

      // Validate file size (e.g., 2MB max)
      if (file.size > 2 * 1024 * 1024) {
        this.imageError = true;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Image size should be less than 2MB'
        });
        return;
      }

      this.imageFile = file;
      this.imageError = false;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.imageFile) {

      this.imageError = true;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload an image'
      });
      return;
    }

    if (this.recipeForm.invalid) {
      this.markFormGroupTouched(this.recipeForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all required fields'
      });
      return;
    }

    this.isSubmitting = true;

    try {
      // Convert image to base64 manually
      const imageBase64 = await this.convertToBase64(this.imageFile);

      const recipe: RecipesInterface = {
        title: this.recipeForm.value.title,
        description: this.recipeForm.value.description,
        category: this.recipeForm.value.category,
        ingredients: this.recipeForm.value.ingredients,
        cooking_instructions: this.recipeForm.value.cooking_instructions,
        image: imageBase64
      };

      await this.firebaseService.addRecipe(recipe);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Recipe added successfully!'
      });

      this.resetForm();
    } catch (error: any) {  // Explicitly type 'error' as 'any'
      console.error('Error:', error);
      let errorMessage = 'Failed to add recipe. Please try again.';
      
      if (error.message.includes('permission-denied')) {
        errorMessage = 'Permission denied. Please sign in.';
      } else if (error.message.includes('network-error')) {
        errorMessage = 'Network error. Please check your connection.';
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage
      });
    } finally {
      this.isSubmitting = false;
    }
  }

  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private resetForm(): void {
    this.recipeForm.reset();
    this.imageFile = null;
    this.imagePreview = null;
    this.imageError = false;
  }
}
