import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { LinkComponent } from '../link/link.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-navbar',
    imports: [
        LogoComponent,
        LinkComponent,
        LoginButtonComponent,
        NgIf
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    constructor(private router: Router) {
    }

    isHomePage(): boolean {
        return this.router.url === '/';
    }

    navigateToHome(): void {
        this.router.navigate(['/']).then(_ => {
        }).catch(e => {
            console.error(e)
        });
    }
}
