import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
    selector: 'app-auth-action',
    templateUrl: './auth-action.component.html',
    styleUrl: './auth-action.component.scss',
})
export class AuthActionComponent {
    @Input() isLogin!: boolean;
    @Input() isDisable!: boolean;
    @Output() SubmitEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(private authService: AuthService) {}

    onSubmit = () => {
        this.SubmitEvent.emit();
    };

    onGoogle = () => {
        this.authService.GoogleAuth();
    };
}
