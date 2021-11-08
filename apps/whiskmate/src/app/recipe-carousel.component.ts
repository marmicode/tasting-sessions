import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Recipe } from './recipe/recipe';
import { RecipePreviewModule } from './recipe/recipe-preview.component';
import { RecipeRepository } from './recipe/recipe-repository.service';

@Component({
  selector: 'wm-recipe-carousel',
  template: `
    <!-- Top navigation buttons. -->
    <ng-container *ngTemplateOutlet="navigation"></ng-container>

    <div class="container">
      <wm-recipe-preview *ngIf="getRecipe() as recipe" [recipe]="recipe">
      </wm-recipe-preview>
    </div>

    <!-- Bottom navigation buttons. -->
    <ng-container *ngTemplateOutlet="navigation"></ng-container>

    <!-- Navigation actions template. -->
    <ng-template #navigation>
      <div *ngIf="recipes">
        <button mat-button color="warn" (click)="reset()">RESET</button>
        <button [disabled]="!hasPrevious()" mat-button (click)="previous()">
          PREVIOUS
        </button>
        <button [disabled]="!hasNext()" mat-button (click)="next()">
          NEXT
        </button>
      </div>
    </ng-template>
  `,
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
export class RecipeCarouselComponent implements OnInit, OnDestroy {
  destroyed$ = new ReplaySubject(1);
  recipeIndex = 0;
  recipes?: Recipe[];

  constructor(private _recipeRepository: RecipeRepository) {}

  ngOnInit() {
    this._recipeRepository
      .getRecipes()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((recipes) => (this.recipes = recipes));
  }

  ngOnDestroy() {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
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
