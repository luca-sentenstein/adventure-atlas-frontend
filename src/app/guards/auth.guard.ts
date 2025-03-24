import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_, __) => {
    const authService = inject(AuthService);
    const router = inject(Router)

    if (authService.isLoggedIn()) {
        return true;
    } else {
        void router.navigate(["/auth"])
        return false;
    }
};
