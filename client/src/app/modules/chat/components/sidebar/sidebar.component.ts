import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { IConversation } from '@interfaces/chat/user.interface';
import { ChatService } from '@services/chat/chat.service';
import { UserService } from '@services/user/user.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit, OnDestroy {
    activeChat!: string;
    previewChats$: Observable<IConversation[]> = this.chatService.previewChatsGetter$;
    destroy$: Subject<void> = new Subject<void>();

    constructor(
        @SkipSelf() @Optional() private chatService: ChatService,
        @SkipSelf() @Optional() private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.chatService
            .getPreviewChats$(this.userService.userGetter?._id || 'unknown')
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    this.chatService.previewChatsSubGetter$.next(value);
                    this.chatService.previewChatsSetter = value;
                },
                error: (error: HttpErrorResponse) => {
                    console.log(error.error?.message);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onActiveConversation = (chatId: string) => {
        this.chatService.activeConversatonSetter = chatId;
        this.activeChat = chatId;
        this.chatService.updateIsReadedMessage(chatId);
    };
}
