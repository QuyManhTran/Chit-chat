import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ModalAnimationType } from '../shares/modal/modal.interface';
import { faFacebookF, faInstagram, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
    isOpenMenu: boolean = false;
    modalType: string = ModalAnimationType.LEFT;
    faFacebook = faFacebookF;
    faTwitter = faTwitter;
    faInstagram = faInstagram;
    faYoutube = faYoutube;
    currentDate = new Date();
    @ViewChild('header') headerRef!: ElementRef<HTMLDivElement>;
    @ViewChild('content') contentRef!: ElementRef<HTMLDivElement>;
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

    onToggleMenu = () => {
        const bodyElement = document.querySelector('body');
        if (!bodyElement) return;
        if (!this.isOpenMenu) {
            this.isOpenMenu = true;
            bodyElement.style.height = '100vh';
            bodyElement.style.overflow = 'hidden';
        } else {
            this.onCloseModal();
        }
    };

    onCloseModal = () => {
        const bodyElement = document.querySelector('body');
        if (!bodyElement) {
            this.isOpenMenu = false;
            return;
        }
        this.closeModalAnimationHandler();
        setTimeout(() => {
            this.isOpenMenu = false;
            bodyElement.style.height = 'auto';
            bodyElement.style.overflow = 'auto';
        }, 500);
    };

    stopPropagationHandler = (event: MouseEvent) => {
        event.stopPropagation();
    };

    closeModalAnimationHandler = () => {
        if (this.contentRef) {
            this.contentRef.nativeElement.classList.add('-translate-x-full');
        }
    };
}
