import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { LinkComponent } from '../links/link/link.component';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from './button/button.component';

@Component({
    selector: 'app-navbar',
    imports: [
        LogoComponent,
        LinkComponent,
        NgIf,
        ButtonComponent
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

    constructor(private router: Router, protected authService: AuthService) {
    }

    ngAfterViewInit(): void {
    }

    isHomePage(): boolean {
        return this.router.url === '/';
    }

    navigateToHome(): void {
        void this.router.navigate(['/'])
    }

    onLogoClick() {
        this.logo.onMouseLeave();
        this.navigateToHome()
    }

    isAuthPage(): boolean {
        return this.router.url === '/auth';
    }

    navigateToAuth() {
        void this.router.navigate(['/auth']);
    }
}
