import { Inject, Injectable } from '@angular/core';
import {
    ILoginRoom,
    RoomStreamUpdateCallBack,
    RoomUserUpdateCallBack,
} from '@interfaces/chat/user.interface';
import { ENV } from '@interfaces/environment/environment.interface';
import { ENVIRONMENT_SERVICE_CONFIG } from 'src/app/configs/tokens/environment.token';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc';

@Injectable({
    providedIn: 'root',
})
export class ZegoCloudService {
    private token!: string;
    private zg: ZegoExpressEngine = new ZegoExpressEngine(
        this.env_config.zego.appId,
        this.env_config.zego.serverId
    );
    constructor(@Inject(ENVIRONMENT_SERVICE_CONFIG) private env_config: ENV) {}

    get tokenGetter(): string {
        return this.token;
    }

    set tokenSetter(_token: string) {
        this.token = _token;
    }

    get zgGetter(): ZegoExpressEngine {
        return this.zg;
    }

    onLogin = (data: ILoginRoom): void => {
        this.zg.loginRoom(data.roomID, this.token, data.user, { userUpdate: true });
    };

    onLogout = (roomId: string): void => {
        this.zg.logoutRoom(roomId);
    };

    onRoomUserUpdate = (roomStreamUpdateCallback: RoomStreamUpdateCallBack) => {
        this.zg.on('roomStreamUpdate', roomStreamUpdateCallback);
    };
}
