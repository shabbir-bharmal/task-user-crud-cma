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
        return !!localStorage.getItem('authToken'); 
    }

    getToken(): string {
        return localStorage.getItem('authToken') ?? ''; 
    }

    login(token: string): void {
        localStorage.setItem('authToken', token); 
    }

    logout(): void {
        localStorage.removeItem('authToken'); 
    }
}