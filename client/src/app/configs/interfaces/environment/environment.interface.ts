import { FireBaseConfig } from '@interfaces/auth/firebase.interface';

export interface ENV {
    host: string;
    firebaseConfig: FireBaseConfig;
    ws: string;
}
