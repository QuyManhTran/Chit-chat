import { Component, OnDestroy, OnInit, Optional, SkipSelf } from '@angular/core';
import { SocketService } from '@services/socket/socket.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
    constructor(@SkipSelf() @Optional() private socketService: SocketService) {}
    ngOnInit(): void {
        this.socketService.onConnect();
    }

    ngOnDestroy(): void {
        this.socketService.onDisconnect();
    }
}
