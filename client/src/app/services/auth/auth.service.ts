import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private accessToken: string = '';
    constructor(private AngularFireAuth: AngularFireAuth) {}

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

    unAuthHandler = () => {
        this.tokenSetter = '';
    };
}
