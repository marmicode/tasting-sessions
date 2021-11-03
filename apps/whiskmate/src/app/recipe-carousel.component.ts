import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Recipe } from './recipe/recipe';
import { RecipePreviewModule } from './recipe/recipe-preview.component';
import { RecipeRepository } from './recipe/recipe-repository.service';

@Component({
  selector: 'wm-recipe-carousel',
  template: `<div class="container">
      <wm-recipe-preview *ngIf="getRecipe() as recipe" [recipe]="recipe">
      </wm-recipe-preview>
    </div>
    <div *ngIf="recipes">
      <button mat-button color="warn" (click)="reset()">RESET</button>
      <button [disabled]="!hasPrevious()" mat-button (click)="previous()">
        PREVIOUS
      </button>
      <button [disabled]="!hasNext()" mat-button (click)="next()">NEXT</button>
    </div> `,
  styles: [
    `
      :host {
        text-align: center;
      }

      .container {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class RecipeCarouselComponent implements OnInit {
  recipeIndex = 0;
  recipes?: Recipe[];

  constructor(private _recipeRepository: RecipeRepository) {}

  ngOnInit() {
    this._recipeRepository
      .getRecipes()
      .subscribe((recipes) => (this.recipes = recipes));
  }

  next() {
    this.recipeIndex++;
  }

  previous() {
    this.recipeIndex--;
  }

  reset() {
    this.recipeIndex = 0;
  }

  getRecipe() {
    return this.recipes?.[this.recipeIndex];
  }

  hasPrevious() {
    return this.recipeIndex > 0;
  }

  hasNext() {
    console.count('compute hasNext...');
    return this.recipeIndex + 1 < (this.recipes?.length ?? 0);
  }
}

@NgModule({
  declarations: [RecipeCarouselComponent],
  exports: [RecipeCarouselComponent],
  imports: [CommonModule, MatButtonModule, RecipePreviewModule],
})
export class RecipeCarouselModule {}
