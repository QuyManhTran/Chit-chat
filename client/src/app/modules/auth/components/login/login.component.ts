import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm } from '@interfaces/auth/login.interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    isRemember: boolean = false;
    isHiddenPass: boolean = true;
    LoginForm!: FormGroup<LoginForm>;

    ngOnInit(): void {
        this.LoginForm = new FormGroup({
            email: new FormControl('', {
                updateOn: 'change',
                validators: [Validators.required, Validators.email],
            }),
            password: new FormControl('', { updateOn: 'change', validators: Validators.required }),
        });
    }

    onRememberMe = (): void => {
        this.isRemember = !this.isRemember;
    };

    onChangeViewPass = (): void => {
        this.isHiddenPass = !this.isHiddenPass;
        console.log(this.isHiddenPass);
    };

    onSubmit = () => {
        console.log(this.LoginForm.value);
    };
}
