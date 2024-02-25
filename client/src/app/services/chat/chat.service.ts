import { Injectable } from '@angular/core';
import { IConversation, IMessage } from '@interfaces/chat/user.interface';
import { UserService } from '@services/user/user.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private activeConversation!: string;
    private previewChatsSub$: Subject<IConversation[]> = new Subject<IConversation[]>();
    private previewChats$: Observable<IConversation[]> = this.previewChatsSub$.asObservable();
    private previewChats!: IConversation[];
    private conversations: Map<string, IMessage[]> = new Map<string, IMessage[]>();
    constructor() {}
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
            },
            isReaded: this.activeConversation === _conversation._id || userId === _message.senderId,
        });
        this.previewChatsSetter = newPreviewChats;
        this.previewChatsSubGetter$.next(this.previewChats);
    };
}
