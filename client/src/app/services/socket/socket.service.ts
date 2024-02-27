import { Inject, Injectable } from '@angular/core';
import { ENV } from '@interfaces/environment/environment.interface';
import { Socket, io } from 'socket.io-client';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private socket: Socket = io(this.env_config.ws, {
        autoConnect: false,
    });
    constructor(@Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV) {}

    get socketGetter(): Socket {
        return this.socket;
    }

    onConnect = (): void => {
        this.socket.connect();
    };

    onDisconnect = (): void => {
        this.socket.disconnect();
    };

    emitOnlineUser = (userId: string): void => {
        this.socket.emit('addNewUser', userId);
    };

    onOffOnlineUser = (): void => {
        this.socket.off('getOnlineUsers');
    };
}
