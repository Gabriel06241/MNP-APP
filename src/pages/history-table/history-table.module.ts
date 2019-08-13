import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryTablePage } from './history-table';

@NgModule({
  declarations: [
    HistoryTablePage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryTablePage),
  ],
})
export class HistoryTablePageModule {}
