import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appScroll]',
})
export class ScrollDirective {
    windowHeight: number = window.innerHeight;
    appearPoint: number = 150;
    constructor(private elementRef: ElementRef, private render: Renderer2) {}
    @HostListener('window:scroll', ['$event'])
    onScroll = () => {
        if (
            this.elementRef.nativeElement.getBoundingClientRect().top <
            this.windowHeight - this.appearPoint
        ) {
            this.render.addClass(this.elementRef.nativeElement, 'active');
        }
    };
}
