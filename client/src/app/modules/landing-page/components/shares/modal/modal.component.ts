import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit, AfterContentInit {
    @ContentChild('content') private contentRef!: ElementRef<HTMLDivElement>;
    @Input() animate!: string;
    @Output() CloseModalEvent: EventEmitter<void> = new EventEmitter<void>();
    ngOnInit(): void {}

    ngAfterContentInit(): void {
        if (this.contentRef) {
            this.contentRef.nativeElement.classList.add(`animation-${this.animate}`);
        }
    }

    onCloseModal = () => {
        this.CloseModalEvent.emit();
    };
}
