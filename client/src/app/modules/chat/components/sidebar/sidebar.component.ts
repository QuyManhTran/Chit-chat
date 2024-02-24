import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    Optional,
    SkipSelf,
    ViewChild,
} from '@angular/core';
import { IConversation } from '@interfaces/chat/user.interface';
import { ChatService } from '@services/chat/chat.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @ViewChild('sidebar') sidebarRef!: ElementRef<HTMLDivElement>;
    activeChat!: string;
    previewChats$: Observable<IConversation[]> = this.chatService.previewChatsGetter$;
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
    constructor(@SkipSelf() @Optional() private chatService: ChatService) {}

    ngOnInit(): void {
        this.activeChat = this.chatService.activeConversationGetter;
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(() => {
            this.chatService.previewChatsSubGetter$.next(this.mockData);
        });
    }

    onActiveConversation = (chatId: string) => {
        this.chatService.activeConversatonSetter = chatId;
        this.activeChat = chatId;
    };
}
