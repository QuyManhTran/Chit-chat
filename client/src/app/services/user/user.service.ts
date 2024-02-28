import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserInfor } from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';
import { LOCAL_STORAGE_TOKE } from 'src/app/configs/tokens/storage.token';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user!: IUserInfor | undefined;
    private isLogged!: boolean;
    constructor(
        @Inject(LOCAL_STORAGE_TOKE) private storage: Storage,
        @Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV,
        private router: Router,
        private http: HttpClient
    ) {}

    get isLoggedGetter(): boolean {
        return this.isLogged;
    }

    set isLoggedSetter(_isLogged: boolean) {
        console.log(this.isLogged);
        this.isLogged = _isLogged;
    }

    get userGetter() {
        return this.user;
    }

    set userSetter(_user: IUserInfor | undefined) {
        this.user = _user;
        this.isLogged = true;
        this.storage.setItem('user', JSON.stringify({ isLogged: this.isLogged }));
    }

    initUser = (): void => {
        const storageUser = this.storage.getItem('user');
        if (storageUser === null) {
            this.isLogged = false;
            return;
        }
        if (storageUser !== null) {
            this.reAuthHandler();
        }
    };

    reAuthHandler = () => {
        this.http.get<IUserInfor>(`${this.env_config.host}/auth/re-auth`).subscribe({
            next: (value) => {
                console.log(value);
                this.userSetter = value;
            },
            error: (error: HttpErrorResponse) => {
                console.log(error.error);
                this.isLogged = false;
            },
            complete: () => {
                this.isLogged = true;
            },
        });
    };

    unAuthHandler = () => {
        this.isLogged = false;
        this.userSetter = undefined;
        this.storage.removeItem('user');
        this.router.navigate(['/auth/login']);
    };
}
