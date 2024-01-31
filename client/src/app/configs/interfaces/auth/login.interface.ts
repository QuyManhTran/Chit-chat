import { Form, FormControl } from '@angular/forms';

export interface LoginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

export interface RegisterForm {
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
}
