import { Component, ElementRef, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { IToastTify } from '@interfaces/toastify/toastify.interface';
import { ToastifyService } from '@services/toastify/toastify.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-toastify',
    templateUrl: './toastify.component.html',
    styleUrl: './toastify.component.scss',
})
export class ToastifyComponent implements OnInit {
    getToastify$!: Observable<IToastTify | undefined>;
    @ViewChild('toastify') toastifyRef!: ElementRef<HTMLDivElement>;
    constructor(@SkipSelf() @Optional() private toastifyService: ToastifyService) {}

    ngOnInit(): void {
        this.getToastify$ = this.toastifyService.getToast$;
    }

    onClose = () => {
        if (this.toastifyRef) this.toastifyRef.nativeElement.classList.add('toastify--close');
        setTimeout(() => {
            this.toastifyService.toast$.next(undefined);
        }, 500);
    };
}
