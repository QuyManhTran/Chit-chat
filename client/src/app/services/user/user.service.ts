import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserInfor } from '@interfaces/chat/user.interface';
import { LOCAL_STORAGE_TOKE } from 'src/app/configs/tokens/storage.token';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private user!: IUserInfor | undefined;
    isLogged!: boolean;
    constructor(@Inject(LOCAL_STORAGE_TOKE) private storage: Storage, private router: Router) {}

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
            this.isLogged = true;
        }
    };

    unAuthHandler = () => {
        this.isLogged = false;
        this.userSetter = undefined;
        this.storage.removeItem('user');
        this.router.navigate(['/auth/login']);
    };
}
