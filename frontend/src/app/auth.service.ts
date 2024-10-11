import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl = 'https://localhost:7077/api/User';
    httpOptions: any = {
        withCredentials: true,
        observe: 'response' as 'response'
    };
    constructor() { }

    isLoggedIn(): boolean {
        let expiresAt : any = localStorage.getItem('expiresAt') ?? new Date();
        expiresAt = new Date(expiresAt).getTime();
        var currentDate = new Date().getTime();
        return expiresAt > currentDate ? !!localStorage.getItem('authToken') : false;
    }

    getToken(): string {
        let expiresAt : any = localStorage.getItem('expiresAt') ?? new Date();
        expiresAt = new Date(expiresAt).getTime();
        var currentDate = new Date().getTime();
        return expiresAt > currentDate ? (localStorage.getItem('authToken') ?? '') : '';
    }

    login(userData: any): void {
        localStorage.setItem('authToken', userData.token);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('expiresAt', userData.expiresAt);
    }

    logout(): void {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('expiresAt');
    }
}