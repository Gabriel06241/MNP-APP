import { ViewController } from 'ionic-angular';
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

  filter: any;

  constructor(
    public viewCtrl: ViewController,
  ) {
    console.log('Hello CategoryComponent Component');
  }

  filterCategory(param) {
    console.log('En el componente... => ', param);
    this.filter = param
    this.close()
  }

  close() {
    console.log('close...')
    this.viewCtrl.dismiss({
      filter: this.filter
    });
  }

}
