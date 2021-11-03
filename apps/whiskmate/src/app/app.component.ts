import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeCarouselModule } from './recipe-carousel.component';

@Component({
  selector: 'wm-app',
  template: `<wm-recipe-carousel></wm-recipe-carousel>`,
  styles: [
    `
      :host {
        margin: 20px;
      }
    `,
  ],
})
export class AppComponent {}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, RecipeCarouselModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
