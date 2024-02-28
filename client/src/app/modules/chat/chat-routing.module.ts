import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { ConversationComponent } from './components/conversation/conversation.component';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        children: [
            {
                path: ':chatId',
                component: ConversationComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule {}
