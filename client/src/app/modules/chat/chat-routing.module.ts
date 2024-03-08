import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { AudioCallComponent } from './components/audio-call/audio-call.component';
import { WrapperchatComponent } from './components/wrapperchat/wrapperchat.component';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        children: [
            {
                path: '',
                component: WrapperchatComponent,
                children: [
                    {
                        path: ':chatId',
                        component: ConversationComponent,
                    },
                ],
            },
            {
                path: 'audio-call/:roomId',
                component: AudioCallComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule {}
