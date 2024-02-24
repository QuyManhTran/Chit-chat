import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-preview-chat',
    templateUrl: './preview-chat.component.html',
    styleUrl: './preview-chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewChatComponent {
    @Input() name!: string;
    @Input() latestMessage!: string;
    @Input() isReaded!: boolean;
    @Input() chatId!: string;
    @Input() isActive!: boolean;
    @Output() activeChatEmiter: EventEmitter<string> = new EventEmitter<string>();
    onActiveConversation = () => {
        this.activeChatEmiter.emit(this.chatId);
    };
}
