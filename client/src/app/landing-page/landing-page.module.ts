import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { BodyComponent } from './components/body/body.component';
import { ScrollDirective } from './directives/events/scroll.directive';
import { PseudoClassDirective } from './directives/pseudo-class/pseudo-class.directive';

@NgModule({
    declarations: [
        HeaderComponent,
        LandingPageComponent,
        BodyComponent,
        ScrollDirective,
        PseudoClassDirective,
    ],
    imports: [CommonModule, LandingPageRoutingModule],
})
export class LandingPageModule {}
