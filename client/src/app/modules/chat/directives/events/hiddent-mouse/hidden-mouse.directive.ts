import { Directive, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';

@Directive({
    selector: '[appHiddenMouse]',
})
export class HiddenMouseDirective implements OnInit, OnDestroy {
    isVisible!: boolean;
    inActiveThreshold: number = 2000;
    private inActiveTimeout!: NodeJS.Timeout;
    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
        this.isVisible = true;
    }

    ngOnDestroy(): void {
        clearTimeout(this.inActiveTimeout);
    }

    @HostListener('document:mousemove')
    resetInactivityTimer() {
        this.activeHandler();
        clearTimeout(this.inActiveTimeout);
        this.inActiveTimeout = setTimeout(() => {
            this.inactiveHandler();
        }, this.inActiveThreshold);
    }

    inactiveHandler = () => {
        if (this.elementRef) {
            this.elementRef.nativeElement.style.visibility = 'hidden';
            this.isVisible = false;
        }
    };

    activeHandler = () => {
        if (!this.isVisible) this.isVisible = true;
        if (this.elementRef) this.elementRef.nativeElement.style.visibility = 'visible';
    };
}
