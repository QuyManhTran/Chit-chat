import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfor } from '@interfaces/chat/user.interface';
import { AuthService } from '@services/auth/auth.service';
import { LOCAL_STORAGE_TOKE } from 'src/app/configs/tokens/storage.token';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    user!: UserInfor | undefined;
    isLogged!: boolean;
    constructor(
        @Inject(LOCAL_STORAGE_TOKE) private storage: Storage,
        private router: Router,
        private authSevice: AuthService
    ) {}

    get userGetter() {
        return this.user;
    }

    set userSetter(_user: UserInfor | undefined) {
        this.user = _user;
    }

    initUser = (): void => {
        const storageUser = this.storage.getItem('user');
        if (storageUser === null) {
            this.isLogged = false;
            return;
        }
        if (storageUser !== null) {
            this.userSetter = JSON.parse(storageUser);
            this.isLogged = true;
        }
    };

    unAuthHandler = () => {
        this.isLogged = false;
        this.userSetter = undefined;
        this.storage.removeItem('user');
        this.authSevice.unAuthHandler();
        this.router.navigate(['/auth/login']);
    };
}
