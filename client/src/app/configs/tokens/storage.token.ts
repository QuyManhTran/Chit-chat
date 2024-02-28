import { InjectionToken } from '@angular/core';

export const LOCAL_STORAGE_TOKE = new InjectionToken<Storage>('storage', {
    providedIn: 'root',
    factory() {
        return localStorage;
    },
});
