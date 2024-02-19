import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterData, IRegisterForm } from '@interfaces/auth/login.interface';
import { ToastStatus } from '@interfaces/toastify/toastify.interface';
import { AuthService } from '@services/auth/auth.service';
import { ToastifyService } from '@services/toastify/toastify.service';
import { UserService } from '@services/user/user.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
    RegisterForm!: FormGroup<IRegisterForm>;
    isLoading!: boolean;
    constructor(
        @SkipSelf() @Optional() private authService: AuthService,
        @SkipSelf() @Optional() private userService: UserService,
        @SkipSelf() @Optional() private toastifyService: ToastifyService,
        private router: Router
    ) {}
    ngOnInit(): void {
        this.RegisterForm = new FormGroup(
            {
                email: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required, Validators.email],
                }),
                name: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required, Validators.minLength(4)],
                }),
                password: new FormControl('', {
                    updateOn: 'change',
                    validators: [
                        Validators.required,
                        Validators.pattern('^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'),
                    ],
                }),
                confirmPassword: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required],
                }),
            },
            {
                validators: this.passwordMatchValidator('password', 'confirmPassword'),
            }
        );
    }

    passwordMatchValidator(password: string, confirmPassword: string) {
        return (control: AbstractControl) => {
            return control.get(password)?.value === control.get(confirmPassword)?.value
                ? null
                : { mismatch: true };
        };
    }

    onSubmit = () => {
        this.isLoading = true;
        const data: IRegisterData = {
            email: this.RegisterForm.value.email || '',
            password: this.RegisterForm.value.password || '',
            name: this.RegisterForm.value.name || '',
        };
        this.authService.registerByPassword$(data).subscribe({
            next: (value) => {
                console.log(value);
                this.userService.userSetter = value;
                this.toastifyService.alert({
                    status: ToastStatus.SUCCESS,
                    title: 'Sign up successfully !',
                    isClose: true,
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
                this.router.navigate(['/chat']);
            },
        });
    };
}
