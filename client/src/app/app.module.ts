import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ENVIRONMENT_CONFIG, ENVIRONMENT_SERVICE_CONFIG } from './configs/tokens/environment.token';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '@envs/environment.development';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieInterceptor } from '@interceptors/cookie/cookie.interceptor';
import { RequestTokenInterceptor } from '@interceptors/request-token/request-token.interceptor';
import { ResponseTokenInterceptor } from '@interceptors/response-token/response-token.interceptor';
import { AuthInterceptor } from '@interceptors/authorization/auth.interceptor';
import { ToastifyModule } from '@modules/toastify/toastify.module';
@NgModule({
    declarations: [AppComponent, NotFoundComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        HttpClientModule,
        ToastifyModule,
    ],
    providers: [
        { provide: ENVIRONMENT_SERVICE_CONFIG, useValue: ENVIRONMENT_CONFIG },
        { provide: HTTP_INTERCEPTORS, useClass: CookieInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RequestTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResponseTokenInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
