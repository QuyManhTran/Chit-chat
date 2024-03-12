import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[appHiddenClick]',
})
export class HiddenClickDirective {
    @Input() isFocus!: boolean;
    @Output() HiddenEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    @HostListener('document:click', ['$event'])
    handleClick(event: MouseEvent) {
        const currentElement = event.target as HTMLElement;
        if (!this.isFocus) return;
        if (currentElement instanceof HTMLInputElement) return;
        if (
            this.elementRef.nativeElement !== currentElement &&
            !this.elementRef.nativeElement.contains(currentElement)
        ) {
            this.HiddenEmitter.emit(false);
        }
    }
}
