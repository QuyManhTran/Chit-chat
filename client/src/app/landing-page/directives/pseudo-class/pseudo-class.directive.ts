import { Directive, ElementRef, Host, HostListener } from '@angular/core';

@Directive({
    selector: '[appPseudoClass]',
})
export class PseudoClassDirective {
    constructor(private elementRef: ElementRef<HTMLSpanElement>) {}
}
