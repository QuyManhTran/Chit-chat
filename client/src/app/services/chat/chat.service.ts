import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
    IConversation,
    IMessage,
    INewAudio,
    INewConversation,
    INewMessage,
    IUserInfor,
    IZegoToken,
} from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { Observable, Subject } from 'rxjs';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private activeConversation!: string;
    private previewChatsSub$: Subject<IConversation[]> = new Subject<IConversation[]>();
    private previewChats$: Observable<IConversation[]> = this.previewChatsSub$.asObservable();
    private previewChats!: IConversation[];
    private conversations: Map<string, IMessage[]> = new Map<string, IMessage[]>();
    private onlineUsers!: string[];
    private onlineUsersSub$: Subject<string[]> = new Subject<string[]>();
    private onlineUsers$: Observable<string[]> = this.onlineUsersSub$.asObservable();
    constructor(
        private http: HttpClient,
        @Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV
    ) {}
    /* getter and setter active conversation */

    get activeConversationGetter(): string {
        return this.activeConversation;
    }

    set activeConversatonSetter(_active: string) {
        this.activeConversation = _active;
    }
    /* getter and setter preview chats */

    get previewChatsGetter$(): Observable<IConversation[]> {
        return this.previewChats$;
    }

    get previewChatsSubGetter$(): Subject<IConversation[]> {
        return this.previewChatsSub$;
    }

    get preveiwChatsGetter(): IConversation[] {
        return this.previewChats;
    }

    set previewChatsSetter(_previewChats: IConversation[]) {
        this.previewChats = _previewChats;
    }

    /* getter and setter conversations */

    get conversationsGetter(): Map<string, IMessage[]> {
        return this.conversations;
    }

    set conversationsSetter(_conversations: Map<string, IMessage[]>) {
        this.conversations = _conversations;
    }

    /* getter and setter online users */
    get onlineUsersGetter(): string[] {
        return this.onlineUsers;
    }

    set onlineUsersSetter(_onlineUsers: string[]) {
        this.onlineUsers = _onlineUsers;
    }

    get onlineUsers$Getter(): Observable<string[]> {
        return this.onlineUsers$;
    }
    get onlineUsersSub$Getter(): Subject<string[]> {
        return this.onlineUsersSub$;
    }
    /* FETCH CONVERSATIONS */

    getPreviewChats$ = (userId: string): Observable<IConversation[]> => {
        return this.http.get<IConversation[]>(`${this.env_config.host}/chat/preview-chats`, {
            params: {
                userId,
            },
        });
    };

    getMessages$ = (chatId: string): Observable<IMessage[]> => {
        return this.http.get<IMessage[]>(`${this.env_config.host}/message/get-messages`, {
            params: {
                chatId: chatId,
            },
        });
    };

    postNewMessage$ = (message: INewMessage): Observable<IMessage> => {
        return this.http.post<IMessage>(
            `${this.env_config.host}/message/new-message/text`,
            message
        );
    };

    postNewAttachment$ = (message: INewMessage): Observable<IMessage> => {
        return this.http.post<IMessage>(
            `${this.env_config.host}/message/new-message/attachment`,
            message
        );
    };

    postNewAudio$ = (message: INewAudio, audio: Blob): Observable<IMessage> => {
        const formData = new FormData();
        formData.append('audio', audio, 'audio.mp3');
        for (const [key, value] of Object.entries(message)) {
            formData.append(key, value);
        }
        return this.http.post<IMessage>(
            `${this.env_config.host}/message/new-message/audio`,
            formData
        );
    };
    /* HANDLE FINDING USERS */

    findUsers$ = (keyword: string): Observable<IUserInfor[]> => {
        return this.http.get<IUserInfor[]>(`${this.env_config.host}/user/find-users`, {
            params: {
                keyword,
            },
        });
    };

    creatConversation$ = (data: INewConversation): Observable<IConversation> => {
        return this.http.post<IConversation>(
            `${this.env_config.host}/chat/create-conversation`,
            data
        );
    };

    /* HANDLE MESSAGE */

    updateConversation = (name: string, _messages: IMessage[]): void => {
        this.conversations.set(name, _messages);
    };

    updateIsReadedMessage = (chatId: string): void => {
        const _conversation: IConversation | undefined = this.previewChats.find(
            (previewChat) => previewChat._id === chatId
        );
        if (!_conversation) return;
        const newPreviewChats: IConversation[] = this.previewChats.map((previewchat) => {
            if (previewchat._id === _conversation._id) {
                return { ..._conversation, isReaded: true };
            }
            return previewchat;
        });
        this.previewChatsSetter = newPreviewChats;
        this.previewChatsSubGetter$.next(this.previewChats);
    };

    updateNewMessage = (_message: IMessage, userId: string): void => {
        const _conversation: IConversation | undefined = this.previewChats.find(
            (previewChat) => previewChat._id === _message.chatId
        );
        if (!_conversation) return;
        let newPreviewChats: IConversation[] = this.previewChats.filter(
            (previewChat) => previewChat._id !== _conversation._id
        );
        newPreviewChats.unshift({
            ..._conversation,
            latestMsg: {
                content: _message.content,
                date: _message.createdAt,
                senderId: _message.senderId,
                type: _message.type,
            },
            isReaded: this.activeConversation === _conversation._id || userId === _message.senderId,
        });
        this.previewChatsSetter = newPreviewChats;
        this.previewChatsSubGetter$.next(this.previewChats);
    };

    updateNewConversation = (_newConversation: IConversation) => {
        this.previewChats = [_newConversation, ...this.previewChats];
        this.previewChatsSub$.next(this.previewChats);
    };

    /* HANDLE AUDIO AND VIDEO CALL */

    getZegoToken$ = (data: IZegoToken): Observable<string> => {
        return this.http.get<string>(`${this.env_config.host}/auth/zego-token`, {
            params: {
                ...data,
            },
        });
    };
}
