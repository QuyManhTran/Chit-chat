import { ChangeDetectionStrategy, Component, OnInit, Optional, SkipSelf } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from '@interfaces/chat/user.interface';
import { ChatService } from '@services/chat/chat.service';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrl: './conversation.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ConversationComponent implements OnInit {
    messages!: IMessage[];
    messageForm!: FormControl<string | null>;

    constructor(
        private activatedRoute: ActivatedRoute,
        @SkipSelf() @Optional() private chatService: ChatService
    ) {
        this.activatedRoute.params.subscribe({
            next: (value) => {
                this.messages = this.chatService.conversationsGetter.get(value?.['chatId']) || [];
                console.log(this.messages);
                this.messageForm = new FormControl<string | null>('');
            },
        });
    }

    ngOnInit(): void {}

    sendMessageHandler = (): void => {
        const newMessage: IMessage = {
            __v: 0,
            _id: '123',
            chatId: this.activatedRoute.snapshot.params?.['chatId'],
            content: this.messageForm.value || '',
            createdAt: new Date(),
            senderId: '123456',
            updatedAt: new Date(),
        };
        this.messages = [newMessage, ...this.messages];
        this.chatService.updateConversation(
            this.activatedRoute.snapshot.params?.['chatId'],
            this.messages
        );
        this.messageForm.reset();
    };
}
