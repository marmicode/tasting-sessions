export interface Recipe {
  id: string;
  description: string;
  ingredients: Ingredient[];
  name: string;
  pictureUri: string;
  steps: string[];
}

export interface Ingredient {
  amount: string;
  name: string;
}

export function createRecipe(recipe: Recipe): Recipe {
  return recipe;
}

export function createIngredient(ingredient: Ingredient): Ingredient {
  return ingredient;
}
