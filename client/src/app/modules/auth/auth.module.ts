import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { AuthActionComponent } from './components/share/auth-action/auth-action.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    declarations: [AuthComponent, LoginComponent, AuthActionComponent, RegisterComponent],
    imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule],
})
export class AuthModule {}
