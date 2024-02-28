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
import { ICaller, IMessage, INewMessage } from '@interfaces/chat/user.interface';
import { ISocketMessage } from '@interfaces/socket/socket.interface';
import { ChatService } from '@services/chat/chat.service';
import { SocketService } from '@services/socket/socket.service';
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
    userId!: string | undefined;
    chatId!: string | undefined;
    caller!: ICaller;

    constructor(
        private activatedRoute: ActivatedRoute,
        @SkipSelf() @Optional() private chatService: ChatService,
        @SkipSelf() @Optional() private userService: UserService,
        @SkipSelf() @Optional() private socketService: SocketService
    ) {
        this.activatedRoute.params.subscribe({
            next: (value) => {
                this.chatId = value?.['chatId'];
                if (this.chatService.conversationsGetter.get(value?.['chatId'])) {
                    this.messages =
                        this.chatService.conversationsGetter.get(value?.['chatId']) || [];
                } else {
                    this.getMessages(value?.['chatId']);
                }
                this.caller = JSON.parse(this.activatedRoute.snapshot.fragment || '');
                this.messageForm = new FormControl<string | null>('');
            },
        });
    }

    ngOnInit(): void {
        this.userId = this.userService.userGetter?._id;
        this.socketService.socketGetter.on('getMessage', (newMessage: IMessage) => {
            if (newMessage.chatId === this.chatId) {
                this.messages = [newMessage, ...this.messages];
                this.chatService.updateConversation(this.chatId, this.messages);
                this.chatService.updateNewMessage(newMessage, newMessage.senderId || '123456789');
            }
        });
    }

    ngOnDestroy(): void {
        this.socketService.onOffGetMessage();
        this.destroy$.next();
        this.destroy$.complete();
    }

    getMessages = (chatId: string) => {
        this.chatService
            .getMessages$(chatId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this.messages = value;
                },
                error: (error) => {
                    console.log(error);
                },
            });
    };

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
                    this.newSocketMessageHandler({ message: value, callerId: this.caller.id });
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

    onEnterKeyup = (): void => {
        if (this.messageForm.value) {
            this.sendMessageHandler();
        }
    };

    newSocketMessageHandler = (socketMessage: ISocketMessage): void => {
        this.socketService.socketGetter.emit('newMessage', socketMessage);
    };
}
