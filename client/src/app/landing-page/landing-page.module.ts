import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { LandingPageComponent } from './landing-page.component';

@NgModule({
    declarations: [HeaderComponent, LandingPageComponent],
    imports: [CommonModule],
})
export class LandingPageModule {}
