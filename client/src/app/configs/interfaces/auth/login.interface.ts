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

export interface IRegisterData {
    name: string;
    email: string;
    password: string;
}

export interface IFireBaseData {
    isNewUser: boolean;
    name: string;
    email: string;
    password: string;
}
