import { SharedModule } from "./shared.module";
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { PAGES, MODULES, PROVIDERS } from './app.imports';
import { SearchPipe } from './../pipes/search';
import { Firebase } from '@ionic-native/firebase'

@NgModule({
  declarations: [PAGES, SearchPipe, MyApp],
  imports: [
    MODULES,
    IonicModule.forRoot(MyApp,{
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    SharedModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [PAGES, MyApp,],
  providers: [PROVIDERS, Firebase, { provide: ErrorHandler, useClass: IonicErrorHandler }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
