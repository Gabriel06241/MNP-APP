import { NgModule } from "@angular/core";
import { IsVisibleDirective } from "./is-visible/is-visible";
import { AutoHideDirective } from './auto-hide/auto-hide';
@NgModule({
  declarations: [IsVisibleDirective,
    AutoHideDirective],
  imports: [],
  exports: [IsVisibleDirective,
    AutoHideDirective]
})
export class DirectivesModule {}
