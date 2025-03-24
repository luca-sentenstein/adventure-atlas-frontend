import { Component } from '@angular/core';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-auth',
    imports: [
        LoginFormComponent,
        RegisterFormComponent,
        NgIf
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
})
export class AuthComponent {
    logInVisible: boolean = true;
    registerVisible: boolean = false;

    toggleForm() {
        this.logInVisible = !this.logInVisible;
        this.registerVisible = !this.registerVisible;
    }
}
