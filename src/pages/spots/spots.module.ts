import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotsPage } from './spots';
import { Ionic2RatingModule } from "ionic2-rating";

@NgModule({
  declarations: [
    SpotsPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotsPage),
    Ionic2RatingModule
  ],
})
export class SpotsPageModule { }
