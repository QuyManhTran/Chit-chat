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
import { Attachment, Call, MessageType } from '@enums/chat.enum';
import {
    ICaller,
    IInComing,
    IMessage,
    INewAudio,
    INewMessage,
} from '@interfaces/chat/user.interface';
import { ISocketMessage } from '@interfaces/socket/socket.interface';
import { ChatService } from '@services/chat/chat.service';
import { SocketService } from '@services/socket/socket.service';
import { UserService } from '@services/user/user.service';
import { Observable, Subject, takeUntil } from 'rxjs';

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
    isRecording!: boolean;
    inCommingCallSub$: Subject<IInComing | undefined> = new Subject<IInComing | undefined>();
    inCommingCall$: Observable<IInComing | undefined> = this.inCommingCallSub$.asObservable();
    audioType: Call = Call.AUDIO;
    videoType: Call = Call.VIDEO;
    @ViewChild('attachment') private attachmentRef!: ElementRef<HTMLInputElement>;
    @ViewChild('ringTone') private ringToneRef!: ElementRef<HTMLAudioElement>;

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
        this.socketService.socketGetter.on('incoming', (data: IInComing) => {
            this.inCommingCallSub$.next(data);
            if (this.ringToneRef) {
                this.ringToneRef.nativeElement.load();
                this.ringToneRef.nativeElement.play();
            }
        });
        this.chatService.onlineUsers$Getter.pipe(takeUntil(this.destroy$)).subscribe({
            next: (value) => {
                this.onlineUsers = value;
            },
        });
    }

    ngOnDestroy(): void {
        this.socketService.onOffGetMessage();
        this.socketService.onOffAudioInComming();
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
            type: MessageType.TEXT,
        };
        this.chatService
            .postNewMessage$(message)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this.newSocketMessageHandler({ message: value, callerId: this.caller.id });
                    this.sucessfulMessageHandler(value);
                },
                error: (error: HttpErrorResponse) => {
                    console.log(error.error?.message);
                },
            });
    };

    sucessfulMessageHandler = (newMessage: IMessage): void => {
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
            if (type !== MessageType.APPLICATION && type !== MessageType.PHOTO)
                return alert("Sorry, your file isn't supported !");
            const type2: string = file.type.split('/')[1];
            if (type2 !== MessageType.DOCUMENT && type === MessageType.APPLICATION)
                return alert('Sorry, My app just apply pdf file !');
            if (size > Attachment.MAX_SIZE) return alert('Sorry, the maxium file size is 5MB !');
            const reader = new FileReader();
            let base64Data: string = '';
            reader.onload = (event) => {
                base64Data = event.target?.result?.toString() || '';
                const newAttachment: INewMessage = {
                    chatId: this.chatId || 'unknown',
                    senderId: this.userId || '123456789',
                    content: base64Data,
                    type: type2 === MessageType.DOCUMENT ? type2 : type,
                    name: name,
                };
                this.newAttachmentHandler(newAttachment);
            };
            reader.readAsDataURL(file);
        }
    };

    newAttachmentHandler = (attachment: INewMessage) => {
        this.chatService
            .postNewAttachment$(attachment)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this.newSocketMessageHandler({ message: value, callerId: this.caller.id });
                    this.sucessfulMessageHandler(value);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    };

    /* HANDLE RECORDING */
    onOpenRecording = () => {
        this.isRecording = true;
    };

    onDiscardRecording = () => {
        this.isRecording = false;
    };

    onSendingAudio = (blob: Blob) => {
        this.isRecording = false;
        const newAudio: INewAudio = {
            chatId: this.chatId || 'unknown',
            senderId: this.userId || '123456789',
            type: MessageType.AUDIO,
        };
        this.chatService
            .postNewAudio$(newAudio, blob)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    console.log(value);
                    this.newSocketMessageHandler({ message: value, callerId: this.caller.id });
                    this.sucessfulMessageHandler(value);
                },
                error: (error) => {
                    console.log(error);
                },
            });
    };

    /* HANDLE AUDIO CALL */

    onCallClick = (type: Call) => {
        this.onPopupCall(this.userId + this.caller.id, false, type);
    };

    onDenyAudioCall = (senderId: string) => {
        this.socketService.socketGetter.emit('deny-audio', senderId);
        this.inCommingCallSub$.next(undefined);
        if (this.ringToneRef) this.ringToneRef.nativeElement.pause();
    };

    onAcceptCall = (roomId: string, streamId: string, type: Call) => {
        this.onPopupCall(roomId, true, type, streamId);
        this.inCommingCallSub$.next(undefined);
        if (this.ringToneRef) this.ringToneRef.nativeElement.pause();
    };

    onPopupCall = (roomId: string, isAccept: boolean, type: Call, streamId?: string) => {
        const width = Math.floor(window.innerWidth * 0.9);
        const height = Math.floor(window.innerHeight);
        const left = window.innerWidth / 2 - width / 2;
        const top = window.innerHeight / 2 - height / 2;
        window.open(
            `http://localhost:4200/chat/audio-call/${roomId}?name=${this.caller.name}&&id=${
                this.caller.id
            }${isAccept ? `&&incoming=true&&streamId=${streamId}` : ''}&&type=${type}`,
            'popup',
            `width=${width}, height=${height}, left=${left}, top=${top}`
        );
    };
}
