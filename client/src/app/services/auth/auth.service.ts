import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { IFireBaseData, ILoginData, IRegisterData } from '@interfaces/auth/login.interface';
import { IUserInfor } from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { UserService } from '@services/user/user.service';
import { Auth, AuthProvider, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
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
        private userService: UserService,
        private router: Router,
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

    FacebookAuth = () => {
        const provider: AuthProvider = new FacebookAuthProvider().setCustomParameters({
            prompt: 'select_account',
        });
        this.AuthLogin(provider);
    };

    AuthLogin = (provider: AuthProvider) => {
        this.AngularFireAuth.signInWithPopup(provider)
            .then((value) => {
                const data: IFireBaseData = {
                    isNewUser: value.additionalUserInfo?.isNewUser || false,
                    email: value.user?.email || '',
                    name: value.user?.displayName || '',
                    password: value.user?.uid || '',
                };
                this.authByFireBase$(data).subscribe({
                    next: (value) => {
                        console.log(value);
                        this.userService.userSetter = value;
                    },
                    error: (error: HttpErrorResponse) => {
                        console.log(error.error?.message);
                    },
                    complete: () => {
                        this.router.navigate(['/chat']);
                    },
                });
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

    authByFireBase$ = (data: IFireBaseData): Observable<IUserInfor> => {
        return this.http.post<IUserInfor>(`${this.env_config.host}/auth/firebase`, data);
    };

    unAuthHandler = () => {
        this.tokenSetter = '';
    };
}
