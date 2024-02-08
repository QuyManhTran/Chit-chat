import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ILoginData, IRegisterData } from '@interfaces/auth/login.interface';
import { IUserInfor } from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { Observable } from 'rxjs';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private accessToken: string = '';
    constructor(
        private AngularFireAuth: AngularFireAuth,
        private http: HttpClient,
        @Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV
    ) {}

    /*
        FIREBASE
    */
    GoogleAuth = () => {
        const provider: AuthProvider = new GoogleAuthProvider().setCustomParameters({
            prompt: 'select_account',
        });
        this.AuthLogin(provider);
    };

    AuthLogin = (provider: AuthProvider) => {
        this.AngularFireAuth.signInWithPopup(provider)
            .then((value) => {
                console.log(value);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    AuthLoggout = () => {
        this.AngularFireAuth.signOut()
            .then((value) => {
                alert('Loggout!');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /* AUTH HANDLE */

    set tokenSetter(_accessToken: string) {
        this.accessToken = _accessToken;
    }

    get tokenGetter() {
        return this.accessToken;
    }

    loginByPassword$ = (data: ILoginData): Observable<IUserInfor> => {
        return this.http.post<IUserInfor>(`${this.env_config.host}/auth/login`, data);
    };

    registerByPassword$ = (data: IRegisterData): Observable<IUserInfor> => {
        return this.http.post<IUserInfor>(`${this.env_config.host}/auth/register`, data);
    };

    unAuthHandler = () => {
        this.tokenSetter = '';
    };
}
