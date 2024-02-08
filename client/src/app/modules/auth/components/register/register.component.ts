import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { IRegisterData, IRegisterForm } from '@interfaces/auth/login.interface';
import { AuthService } from '@services/auth/auth.service';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
    RegisterForm!: FormGroup<IRegisterForm>;
    error$: Subject<string> = new Subject<string>();
    getError$: Observable<string> = this.error$.asObservable();
    isError!: boolean;
    isLoading!: boolean;
    constructor(@SkipSelf() @Optional() private authService: AuthService) {}
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
        if (this.isError) this.error$.next('');
        const data: IRegisterData = {
            email: this.RegisterForm.value.email || '',
            password: this.RegisterForm.value.password || '',
            name: this.RegisterForm.value.name || '',
        };
        this.authService.registerByPassword$(data).subscribe({
            next: (value) => {
                console.log(value);
            },
            error: (error: HttpErrorResponse) => {
                this.error$.next(error.error?.message);
                this.isError = true;
                this.isLoading = false;
            },
            complete: () => {
                this.isLoading = false;
            },
        });
    };

    onFocus = () => {
        if (this.isError) {
            this.isError = false;
            this.error$.next('');
        }
    };
}
