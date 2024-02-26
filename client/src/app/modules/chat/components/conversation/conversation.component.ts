import { HttpErrorResponse } from '@angular/common/http';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    Optional,
    SkipSelf,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IMessage, INewMessage } from '@interfaces/chat/user.interface';
import { ChatService } from '@services/chat/chat.service';
import { UserService } from '@services/user/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-conversation',
    templateUrl: './conversation.component.html',
    styleUrl: './conversation.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class ConversationComponent implements OnInit, OnDestroy {
    messages!: IMessage[];
    messageForm!: FormControl<string | null>;
    destroy$: Subject<void> = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        @SkipSelf() @Optional() private chatService: ChatService,
        @SkipSelf() @Optional() private userService: UserService
    ) {
        this.activatedRoute.params.subscribe({
            next: (value) => {
                this.messages = this.chatService.conversationsGetter.get(value?.['chatId']) || [];
                this.messageForm = new FormControl<string | null>('');
            },
        });
    }

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    sendMessageHandler = (): void => {
        const message: INewMessage = {
            chatId: this.activatedRoute.snapshot.params?.['chatId'],
            senderId: this.userService.userGetter?._id || '123456789',
            content: this.messageForm.value || '',
        };
        this.chatService
            .postNewMessage$(message)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    console.log(value);
                },
                error: (error: HttpErrorResponse) => {
                    console.log(error.error?.message);
                },
                complete: () => {
                    this.sucessfulMessageHandler();
                },
            });
    };

    sucessfulMessageHandler = (): void => {
        const newMessage: IMessage = {
            __v: 0,
            _id: '123',
            chatId: this.activatedRoute.snapshot.params?.['chatId'],
            senderId: this.userService.userGetter?._id || '123456789',
            content: this.messageForm.value || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.messages = [newMessage, ...this.messages];
        this.chatService.updateConversation(
            this.activatedRoute.snapshot.params?.['chatId'],
            this.messages
        );
        this.chatService.updateNewMessage(
            newMessage,
            this.userService.userGetter?._id || '123456789'
        );
        this.messageForm.reset();
    };

    onEnterKeyup = () => {
        if (this.messageForm.value) {
            this.sendMessageHandler();
        }
    };
}
