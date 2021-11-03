import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  BehaviorSubject,
  combineLatest,
  map,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import { RecipePreviewModule } from './recipe/recipe-preview.component';
import { RecipeRepository } from './recipe/recipe-repository.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wm-recipe-carousel',
  template: `<div class="container">
      <wm-recipe-preview *ngIf="recipe$ | async as recipe" [recipe]="recipe">
      </wm-recipe-preview>
    </div>
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
export class RecipeCarouselComponent implements OnDestroy {
  destroyed$ = new Subject();

  recipeIndex$ = new BehaviorSubject(0);
  recipes$ = this._recipeRepository
    .getRecipes()
    .pipe(takeUntil(this.destroyed$), shareReplay(1));

  recipe$ = combineLatest([this.recipes$, this.recipeIndex$]).pipe(
    map(([recipes, index]) => recipes?.[index])
  );
  hasPrevious$ = this.recipeIndex$.pipe(map((index) => index > 0));
  hasNext$ = combineLatest([this.recipes$, this.recipeIndex$]).pipe(
    map(([recipes, index]) => {
      console.count('compute hasNext...');
      return index + 1 < recipes.length;
    })
  );

  constructor(private _recipeRepository: RecipeRepository) {}

  ngOnDestroy() {
    this.destroyed$.next(undefined);
    this.destroyed$.complete();
  }

  next() {
    this.recipeIndex$.next(this.recipeIndex$.value + 1);
  }

  previous() {
    this.recipeIndex$.next(this.recipeIndex$.value - 1);
  }

  reset() {
    this.recipeIndex$.next(0);
  }
}

@NgModule({
  declarations: [RecipeCarouselComponent],
  exports: [RecipeCarouselComponent],
  imports: [CommonModule, MatButtonModule, RecipePreviewModule],
})
export class RecipeCarouselModule {}
