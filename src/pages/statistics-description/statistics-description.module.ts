import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticsDescriptionPage } from './statistics-description';

@NgModule({
  declarations: [
    StatisticsDescriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticsDescriptionPage),
  ],
})
export class StatisticsDescriptionPageModule {}
