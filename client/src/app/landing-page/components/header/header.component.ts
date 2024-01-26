import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
    @ViewChild('header') headerRef!: ElementRef<HTMLDivElement>;
    ngAfterViewInit(): void {
        window.addEventListener('scroll', this.scrollListener);
    }

    scrollListener = () => {
        if (window.scrollY > 80) {
            this.headerRef.nativeElement.classList.add('header-scroll');
        } else {
            this.headerRef.nativeElement.classList.remove('header-scroll');
        }
    };

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.scrollListener);
    }
}
