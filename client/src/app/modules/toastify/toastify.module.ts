import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastifyComponent } from './component/toastify.component';

@NgModule({
    declarations: [ToastifyComponent],
    imports: [CommonModule],
    exports: [ToastifyComponent],
})
export class ToastifyModule {}
