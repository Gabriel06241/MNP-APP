import { Component } from '@angular/core';

/**
 * Generated class for the CategoryComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'category',
  templateUrl: 'category.html'
})
export class CategoryComponent {

  text: string;

  constructor() {
    console.log('Hello CategoryComponent Component');
    this.text = 'Hello World';
  }

  filterCategory(param) {
    console.log('En el componente... => ', param);
  }

}
