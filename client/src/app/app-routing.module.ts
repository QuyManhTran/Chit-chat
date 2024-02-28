import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuard } from '@guards/auth/auth.guard';
import { chatGuard } from '@guards/chat/chat.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('../app/modules/landing-page/landing-page.module').then(
                (m) => m.LandingPageModule
            ),
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
        canActivate: [authGuard],
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
    },
    {
        path: 'chat',
        loadChildren: () => import('./modules/chat/chat.module').then((m) => m.ChatModule),
        canActivate: [chatGuard],
    },
    {
        path: '**',
        redirectTo: '/not-found',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
