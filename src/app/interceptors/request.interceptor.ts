import { HttpContextToken, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

export const AUTH_REQUIRED = new HttpContextToken(() => true);

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService)
    const router = inject(Router);

    let headers = req.body ? new HttpHeaders({"Content-Type": "application/json"}) : new HttpHeaders();

    if (req.context.get(AUTH_REQUIRED)) {
        headers.set("Authorization", "Bearer " + authService.getToken())
    }

    const modifiedReq = req.clone({
        headers: headers
    })

    return next(modifiedReq).pipe(
        catchError(err => {
            if (err.status === 401 && router.url !== "/auth") {
                void router.navigate(["/auth"])
                alert("Your session is over. Please log in again.")
            }
            return Promise.reject(err)
        })
    );
};
