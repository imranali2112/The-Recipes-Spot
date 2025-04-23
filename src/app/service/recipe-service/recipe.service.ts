import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environment';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, startAt, endAt, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { RecipesInterface } from '../../interface/recipes-interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private app;
  private db;
  private storage;

  // Signals for reactive state tracking
  recipeAdded = signal<boolean>(false);
  errorOccurred = signal<string | null>(null);
  recipes = signal<RecipesInterface[]>([]);
  loading = signal<boolean>(false);
  selectedCategory = signal<string | null>(null);

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);
  }

  async addRecipe(recipe: RecipesInterface) {
    try {
      const docRef = await addDoc(collection(this.db, 'recipes'), {
        title: recipe.title,
        description: recipe.description,
        category: recipe.category,
        ingredients: recipe.ingredients,
        cooking_instructions: recipe.cooking_instructions,
        image: recipe.image,
      });

      recipe.id = docRef.id;
      this.recipeAdded.set(true);
      this.errorOccurred.set(null);
      return docRef.id;
    } catch (e) {
      console.error('Error adding recipe:', e);
      this.recipeAdded.set(false);
      this.errorOccurred.set('Failed to add recipe to Firestore.');
      throw new Error('Failed to add recipe');
    }
  }

  async processImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async getAllRecipes(): Promise<RecipesInterface[]> {
    this.loading.set(true);
    this.errorOccurred.set(null);
    try {
      const snapshot = await getDocs(query(collection(this.db, 'recipes')));
      const recipes: RecipesInterface[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecipesInterface[];
      this.recipes.set(recipes);
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      this.errorOccurred.set('Failed to fetch recipes.');
      throw new Error('Failed to fetch recipes');
    } finally {
      this.loading.set(false);
    }
  }

  async searchRecipesByTitle(title: string) {
    this.loading.set(true);
    this.errorOccurred.set(null);
    try {
      const q = query(
        collection(this.db, 'recipes'),
        orderBy('title'),
        startAt(title),
        endAt(title + '\uf8ff')
      );

      const snapshot = await getDocs(q);
      const filteredRecipes: RecipesInterface[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecipesInterface[];

      this.recipes.set(filteredRecipes);
    } catch (error) {
      console.error('Error filtering recipes by title:', error);
      this.errorOccurred.set('Failed to filter recipes by title.');
    } finally {
      this.loading.set(false);
    }
  }

  async getRecipeById(id: string): Promise<RecipesInterface | null> {
    try {
      const docRef = doc(this.db, 'recipes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as RecipesInterface;
      } else {
        console.warn('No such recipe!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, 'recipes', recipeId));
      console.log(`✅ Recipe with ID ${recipeId} deleted`);
    } catch (error) {
      console.error('❌ Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }
  
}
