import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILoginData, ILoginForm } from '@interfaces/auth/login.interface';
import { ToastStatus } from '@interfaces/toastify/toastify.interface';
import { AuthService } from '@services/auth/auth.service';
import { ToastifyService } from '@services/toastify/toastify.service';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    isRemember: boolean = false;
    isHiddenPass: boolean = true;
    LoginForm!: FormGroup<ILoginForm>;
    isLoading!: boolean;
    constructor(
        @SkipSelf() @Optional() private authService: AuthService,
        private toastifyService: ToastifyService
    ) {}

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
    };

    onSubmit = () => {
        this.isLoading = true;
        const data: ILoginData = {
            email: this.LoginForm.value.email || '',
            password: this.LoginForm.value.password || '',
        };
        this.authService.loginByPassword$(data).subscribe({
            next: (value) => {
                console.log(value);
                this.toastifyService.alert({
                    status: ToastStatus.SUCCESS,
                    title: 'Login successfully!',
                });
            },
            error: (error: HttpErrorResponse) => {
                this.isLoading = false;
                this.toastifyService.alert({
                    status: ToastStatus.ERROR,
                    title: error.error?.message || 'Something went wrong !',
                });
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    };
}
