import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BASE_URL } from '../../constants';
import { AUTH_REQUIRED } from '../interceptors/request.interceptor';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    isLoggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    getToken() {
        return localStorage.getItem('access');
    }

    login(data: { userName: string, password: string }) {
        return this.httpClient.post(
            BASE_URL + '/auth/login',
            data,
            {
                context: new HttpContext().set(AUTH_REQUIRED, false),
                responseType: 'text',
            }
        ).pipe(
            tap(response => {
                localStorage.setItem('access', response);
            })
        )
    }

    register(data: { "firstName": string, "lastName": string, "userName": string, "email": string, "password": string }) {
        return this.httpClient.post(
            BASE_URL + '/user',
            data,
            {
                context: new HttpContext().set(AUTH_REQUIRED, false),
                responseType: 'text',
            }
        )
    }

    logout() {
        localStorage.removeItem('access');
        void this.router.navigate(['/']);
        alert("You have been logged out");
    }

    private isTokenExpired(token: string) {
        const decodedToken = jwtDecode(token);
        if (decodedToken && decodedToken.exp) {
            return decodedToken.exp * 1000 < Date.now();
        }
        return true;
    }
}
