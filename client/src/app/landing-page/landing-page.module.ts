import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LandingPageComponent } from './landing-page.component';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { BodyComponent } from './components/body/body.component';
import { ScrollDirective } from './directives/events/scroll.directive';
import { PseudoClassDirective } from './directives/pseudo-class/pseudo-class.directive';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        HeaderComponent,
        LandingPageComponent,
        BodyComponent,
        ScrollDirective,
        PseudoClassDirective,
        FooterComponent,
    ],
    imports: [CommonModule, LandingPageRoutingModule, FontAwesomeModule],
})
export class LandingPageModule {}
