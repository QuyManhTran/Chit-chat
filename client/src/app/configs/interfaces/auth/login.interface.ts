import { Form, FormControl } from '@angular/forms';

export interface ILoginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface IRegisterForm {
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}

export interface ILoginData {
    email: string;
    password: string;
}
