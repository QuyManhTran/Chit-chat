import { OnInit, Component, Optional, SkipSelf, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { INewConversation, IUserInfor } from '@interfaces/chat/user.interface';
import { ChatService } from '@services/chat/chat.service';
import { UserService } from '@services/user/user.service';
import { Observable, Subject, debounceTime, map, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
    destroy$: Subject<void> = new Subject<void>();
    searchForm!: FormControl<string | null>;
    findingUsers!: IUserInfor[];
    isFocus!: boolean;
    constructor(
        @SkipSelf() @Optional() private chatService: ChatService,
        @SkipSelf() @Optional() private userService: UserService
    ) {}

    ngOnInit(): void {
        this.searchForm = new FormControl<string | null>('');
        this.searchForm.valueChanges
            .pipe(
                debounceTime(500),
                switchMap((value) => {
                    if (value) return this.chatService.findUsers$(value || '');
                    return new Observable<IUserInfor[]>((subscriber) => {
                        subscriber.next([]);
                    });
                }),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (value) => {
                    this.findingUsers = value.filter(
                        (user) => !(user._id === this.userService.userGetter?._id)
                    );
                },
                error: (error) => {
                    console.log(error);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onFocus = () => {
        this.isFocus = true;
    };

    onBlur = () => {
        this.isFocus = false;
    };

    onCreate = (callerId: string, callerName: string) => {
        const data: INewConversation = {
            caller: {
                id: callerId,
                name: callerName,
            },
            senderId: this.userService.userGetter?._id || 'unknown',
        };

        this.chatService
            .creatConversation$(data)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (value) => {
                    this.chatService.updateNewConversation(value);
                },
                error: (error) => {
                    console.log(error);
                },
                complete: () => {
                    this.isFocus = false;
                },
            });
    };

    onClickEvent = (value: boolean) => {
        this.isFocus = value;
    };
}
