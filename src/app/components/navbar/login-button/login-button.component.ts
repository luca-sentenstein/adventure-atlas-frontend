import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'navbar-login-button',
    imports: [
        RouterLink
    ],
    templateUrl: './login-button.component.html',
    styleUrl: './login-button.component.scss'
})
export class LoginButtonComponent {
    @Input() link: string = "";
}
