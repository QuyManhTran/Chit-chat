import { FireBaseConfig } from '@interfaces/auth/firebase.interface';

export interface ENV {
    host: string;
    firebaseConfig: FireBaseConfig;
    ws: string;
    zego: {
        appId: number;
        serverId: string;
    };
}
