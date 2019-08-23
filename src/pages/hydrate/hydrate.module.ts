import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HydratePage } from './hydrate';

@NgModule({
  declarations: [
    HydratePage,
  ],
  imports: [
    IonicPageModule.forChild(HydratePage),
  ],
})
export class HydratePageModule {}
