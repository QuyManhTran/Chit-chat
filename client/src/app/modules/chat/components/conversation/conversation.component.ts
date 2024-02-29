import { HttpErrorResponse } from '@angular/common/http';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Optional,
    SkipSelf,
    ViewChild,
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
export class ConversationComponent implements OnInit, OnDestroy, AfterViewInit {
    messages!: IMessage[];
    messageForm!: FormControl<string | null>;
    onlineUsers!: string[];
    destroy$: Subject<void> = new Subject<void>();
    userId!: string | undefined;
    chatId!: string | undefined;
    caller!: ICaller;
    isEmoji!: boolean;
    @ViewChild('attachment') private attachmentRef!: ElementRef<HTMLInputElement>;

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
                    this.chatService.conversationsGetter.get(value?.['chatId']);
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
        this.onlineUsers = this.chatService.onlineUsersGetter || [];
        this.socketService.socketGetter.on('getMessage', (newMessage: IMessage) => {
            if (newMessage.chatId === this.chatId) {
                this.messages = [newMessage, ...this.messages];
                this.chatService.updateConversation(this.chatId, this.messages);
                this.chatService.updateNewMessage(newMessage, this.userId || '123456789');
            }
        });
        this.chatService.onlineUsers$Getter.pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                console.log('fdjsa', value);
                this.onlineUsers = value;
            },
        });
    }

    ngOnDestroy(): void {
        this.socketService.onOffGetMessage();
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngAfterViewInit(): void {
        // console.log(this.attachmentRef.nativeElement.click());
    }

    getMessages = (chatId: string) => {
        this.chatService
            .getMessages$(chatId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    this.messages = value;
                    this.chatService.conversationsSetter = this.chatService.conversationsGetter.set(
                        chatId,
                        value
                    );
                },
                error: (error) => {
                    console.log(error);
                },
            });
    };

    sendMessageHandler = (): void => {
        const message: INewMessage = {
            chatId: this.activatedRoute.snapshot.params?.['chatId'],
            senderId: this.userId || '123456789',
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
            senderId: this.userId || '123456789',
            content: this.messageForm.value || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.messages = [newMessage, ...this.messages];
        this.chatService.updateConversation(
            this.activatedRoute.snapshot.params?.['chatId'],
            this.messages
        );
        this.chatService.updateNewMessage(newMessage, this.userId || '123456789');
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

    /* HANDLE EMOJI */

    onStopPropagation = (event: MouseEvent) => {
        event.stopPropagation();
    };

    onCloseEmoji = () => {
        if (this.isEmoji) {
            this.isEmoji = false;
        }
    };

    onToggleEmoji = (event: MouseEvent) => {
        event.stopPropagation();
        this.isEmoji = !this.isEmoji;
    };

    emojiHandler = (event: any) => {
        const emoji = event?.emoji?.native;
        this.messageForm.setValue(this.messageForm.value + emoji);
    };

    /* HANDLE ATTACHMENT */
    onBrowser = () => {
        if (this.attachmentRef) {
            this.attachmentRef.nativeElement.click();
        }
    };

    onChangeAttachment = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const { name, size }: { name: string; size: number } = file;
            const type: string = file.type.split('/')[0];
            console.log({ name, size, type });
            const reader = new FileReader();

            reader.onload = function (event) {
                const base64Data = event.target?.result;
            };
            reader.readAsDataURL(file);
        }
    };
}
