import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-auth-action',
    templateUrl: './auth-action.component.html',
    styleUrl: './auth-action.component.scss',
})
export class AuthActionComponent {
    @Input() isLogin!: boolean;
    @Input() isDisable!: boolean;
    @Output() SubmitEvent: EventEmitter<void> = new EventEmitter<void>();

    onSubmit = () => {
        this.SubmitEvent.emit();
    };
}
