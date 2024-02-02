import { Component, OnInit } from '@angular/core';
import {
    NavigationCancel,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
    Event as RouterEvent,
} from '@angular/router';
import { LoadingType } from '@enums/app.enum';
import { UserService } from '@services/user/user.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'chit-chat';
    isLoading: boolean = false;
    loadingType: LoadingType = LoadingType.FAST;

    constructor(private router: Router, private userService: UserService) {
        this.router.events.subscribe((event) => {
            this.navigationInterceptor(event);
        });
    }

    ngOnInit(): void {
        this.userService.initUser();
    }

    navigationInterceptor = (event: RouterEvent): void => {
        if (event instanceof NavigationStart) {
            if (event.url === '/') this.loadingType = LoadingType.FAST;
            else this.loadingType = LoadingType.WAITING;
            this.isLoading = true;
        }
        if (event instanceof NavigationEnd) this.isLoading = false;
        if (event instanceof NavigationCancel) this.isLoading = true;
        if (event instanceof NavigationError) this.isLoading = true;
    };
}
