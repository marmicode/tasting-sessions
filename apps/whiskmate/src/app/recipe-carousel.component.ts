import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RxState, select, selectSlice } from '@rx-angular/state';
import { map, switchMap, timer } from 'rxjs';
import { Recipe } from './recipe/recipe';
import { RecipePreviewModule } from './recipe/recipe-preview.component';
import { RecipeRepository } from './recipe/recipe-repository.service';

export interface State {
  recipes: Recipe[];
  recipeIndex: number;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-carousel',
  template: `
    <!-- Top navigation buttons. -->
    <ng-container *ngTemplateOutlet="navigation"></ng-container>

    <div class="container">
      <wm-recipe-preview *ngIf="recipe$ | async as recipe" [recipe]="recipe">
      </wm-recipe-preview>
    </div>

    <!-- Bottom navigation buttons. -->
    <ng-container *ngTemplateOutlet="navigation"></ng-container>

    <!-- Navigation actions template. -->
    <ng-template #navigation>
      <div *ngIf="recipes$ | async">
        <button mat-button color="warn" (click)="reset()">RESET</button>
        <button
          [disabled]="(hasPrevious$ | async) !== true"
          mat-button
          (click)="previous()"
        >
          PREVIOUS
        </button>
        <button
          [disabled]="(hasNext$ | async) !== true"
          mat-button
          (click)="next()"
        >
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
  providers: [RxState],
})
export class RecipeCarouselComponent {
  recipe$ = this._state.select(
    selectSlice(['recipes', 'recipeIndex']),
    map(({ recipes, recipeIndex }) => recipes?.[recipeIndex])
  );

  hasPrevious$ = this._state
    .select('recipeIndex')
    .pipe(select(map((index) => index > 0)));

  hasNext$ = this._state.select(
    selectSlice(['recipes', 'recipeIndex']),
    map(({ recipes, recipeIndex }) => {
      console.count('compute hasNext...');
      return recipeIndex + 1 < recipes.length;
    })
  );

  recipes$ = this._state.select('recipes');

  constructor(
    private _recipeRepository: RecipeRepository,
    private _state: RxState<State>
  ) {
    this._state.set({ recipeIndex: 0 });
    this._state.connect(
      'recipes',
      timer(0, 1000).pipe(switchMap(() => this._recipeRepository.getRecipes()))
    );
    this._state.connect(
      'recipes',
      timer(0, 1000).pipe(switchMap(() => this._recipeRepository.getRecipes()))
    );
  }

  next() {
    this._state.set(({ recipeIndex }) => ({ recipeIndex: recipeIndex + 1 }));
  }

  previous() {
    this._state.set(({ recipeIndex }) => ({ recipeIndex: recipeIndex - 1 }));
  }

  reset() {
    this._state.set({ recipeIndex: 0 });
  }
}

@NgModule({
  declarations: [RecipeCarouselComponent],
  exports: [RecipeCarouselComponent],
  imports: [CommonModule, MatButtonModule, RecipePreviewModule],
})
export class RecipeCarouselModule {}
