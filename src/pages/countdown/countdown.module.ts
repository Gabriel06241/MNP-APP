import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountdownPage } from './countdown';

@NgModule({
  declarations: [
    CountdownPage,
  ],
  imports: [
    IonicPageModule.forChild(CountdownPage),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CountdownPageModule {}
