import { SharedModule } from "./shared.module";
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { PAGES, MODULES, PROVIDERS } from './app.imports';
import { DatabaseProvider } from '../providers/database/database';
import { SpotProvider } from '../providers/spot/spot';

@NgModule({
  declarations: [PAGES, MyApp],
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
  providers: [PROVIDERS, { provide: ErrorHandler, useClass: IonicErrorHandler },
    DatabaseProvider,
    SpotProvider],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
