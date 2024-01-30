import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    isRemember: boolean = false;
    isHiddenPass: boolean = true;
    onRememberMe = (): void => {
        this.isRemember = !this.isRemember;
    };

    onChangeViewPass = (): void => {
        this.isHiddenPass = !this.isHiddenPass;
        console.log(this.isHiddenPass);
    };
}
