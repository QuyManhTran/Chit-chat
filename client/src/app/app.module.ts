import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ENVIRONMENT_CONFIG, ENVIRONMENT_SERVICE_CONFIG } from './configs/tokens/environment.token';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '@envs/environment.development';
@NgModule({
    declarations: [AppComponent, NotFoundComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
    ],
    providers: [{ provide: ENVIRONMENT_SERVICE_CONFIG, useValue: ENVIRONMENT_CONFIG }],
    bootstrap: [AppComponent],
})
export class AppModule {}
