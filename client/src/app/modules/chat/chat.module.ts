import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [ChatComponent, HeaderComponent, SidebarComponent],
    imports: [CommonModule, ChatRoutingModule],
})
export class ChatModule {}
