import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ILoginData, ILoginForm } from '@interfaces/auth/login.interface';
import { AuthService } from '@services/auth/auth.service';
import { Observable, Subject, catchError, of } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    isRemember: boolean = false;
    isHiddenPass: boolean = true;
    LoginForm!: FormGroup<ILoginForm>;
    error$: Subject<string> = new Subject<string>();
    getError$: Observable<string> = this.error$.asObservable();
    constructor(@SkipSelf() @Optional() private authService: AuthService) {}

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
        const data: ILoginData = {
            email: this.LoginForm.value.email || '',
            password: this.LoginForm.value.password || '',
        };
        this.authService.loginByPassword$(data).subscribe({
            next: (value) => {
                console.log(value);
            },
            error: (error: HttpErrorResponse) => {
                this.error$.next(error.error?.message);
            },
        });
    };
}
