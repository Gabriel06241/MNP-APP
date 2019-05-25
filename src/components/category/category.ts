import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';

@Component({
  selector: 'category',
  templateUrl: 'category.html'
})
export class CategoryComponent {

  filter: any;

  constructor(public viewCtrl: ViewController) { }

  filterCategory(param) {
    this.filter = param
    this.close()
  }

  close() {
    this.viewCtrl.dismiss({
      filter: this.filter
    });
  }

}
