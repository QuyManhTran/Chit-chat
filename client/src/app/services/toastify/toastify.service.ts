import { Injectable } from '@angular/core';
import { IToastTify, ToastStatus } from '@interfaces/toastify/toastify.interface';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToastifyService {
    toast$: Subject<IToastTify | undefined> = new Subject<IToastTify | undefined>();
    getToast$: Observable<IToastTify | undefined> = this.toast$.asObservable();
    constructor() {}

    alert = (_toastify: IToastTify) => {
        this.toast$.next(_toastify);
        setTimeout(() => {
            this.toast$.next(undefined);
        }, 4000);
    };
}
