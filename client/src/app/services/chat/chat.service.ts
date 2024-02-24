import { Injectable } from '@angular/core';
import { IConversation, IMessage } from '@interfaces/chat/user.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    mockData: IConversation[] = [
        {
            _id: '1',
            __v: 0,
            callerId: '123456789',
            members: [],
            createAt: new Date(),
            updatedAt: new Date(),
            isReaded: true,
            latestMessage: 'Do you love me?',
            name: 'Crush',
        },
        {
            _id: '2',
            __v: 0,
            callerId: '987654321',
            members: [],
            createAt: new Date(),
            updatedAt: new Date(),
            isReaded: false,
            latestMessage: `Don't you love me?`,
            name: 'Em iu',
        },
    ];
    private activeConversation!: string;
    private previewChatsSub$: Subject<IConversation[]> = new Subject<IConversation[]>();
    private previewChats$: Observable<IConversation[]> = this.previewChatsSub$.asObservable();
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
}
