import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { LinkComponent } from '../link/link.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-navbar',
    imports: [
        LogoComponent,
        LinkComponent,
        LoginButtonComponent,
        NgIf
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('0.5s ease-in-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('0.5s ease-in-out', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class NavbarComponent implements AfterViewInit {
    @ViewChild("logo") logo!: LogoComponent;

    constructor(private router: Router) {
    }

    ngAfterViewInit(): void {
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

    onLogoClick() {
        this.logo.onMouseLeave();
        this.navigateToHome()
    }
}
