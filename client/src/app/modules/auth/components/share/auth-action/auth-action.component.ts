import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-auth-action',
    templateUrl: './auth-action.component.html',
    styleUrl: './auth-action.component.scss',
})
export class AuthActionComponent {
    @Input() isLogin!: boolean;
}
