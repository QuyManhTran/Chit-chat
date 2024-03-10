import { Component, Input } from '@angular/core';
import { MessageType } from '@enums/chat.enum';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrl: './message.component.scss',
})
export class MessageComponent {
    @Input() isMine!: boolean;
    @Input() content!: string;
    @Input() date!: Date;
    @Input() type!: MessageType;
    @Input() name!: string;
}
