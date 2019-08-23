import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutinesPage } from './routines';
import { RoundProgressEase, RoundProgressModule, ROUND_PROGRESS_DEFAULTS } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    RoutinesPage,
  ],
  imports: [
    IonicPageModule.forChild(RoutinesPage),
    RoundProgressEase, RoundProgressModule
  ],
  providers: [{
    provide: ROUND_PROGRESS_DEFAULTS,
    useValue: {
      color: '#f00',
      background: '#0f0'
    }
  }]
})
export class RoutinesPageModule { }
