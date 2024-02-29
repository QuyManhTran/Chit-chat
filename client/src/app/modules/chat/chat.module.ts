import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PreviewChatComponent } from './components/share/preview-chat/preview-chat.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { MessageComponent } from './components/share/message/message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@NgModule({
    declarations: [
        ChatComponent,
        HeaderComponent,
        SidebarComponent,
        PreviewChatComponent,
        ConversationComponent,
        MessageComponent,
    ],
    imports: [CommonModule, ChatRoutingModule, ReactiveFormsModule, PickerComponent],
})
export class ChatModule {}
