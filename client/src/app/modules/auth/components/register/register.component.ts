import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { IRegisterForm } from '@interfaces/auth/login.interface';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
    RegisterForm!: FormGroup<IRegisterForm>;
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
        console.log(this.RegisterForm.value);
    };
}
