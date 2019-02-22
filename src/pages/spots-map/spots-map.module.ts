import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpotsMapPage } from './spots-map';

@NgModule({
  declarations: [
    SpotsMapPage,
  ],
  imports: [
    IonicPageModule.forChild(SpotsMapPage),
  ],
})
export class SpotsMapPageModule {}
