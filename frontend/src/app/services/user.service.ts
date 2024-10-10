import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'https://localhost:7077/api/User';
  httpOptions: any = {
    withCredentials : true,
    observe: 'response' as 'response'
  };
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<User[]> {
    const headers = this.getHeaders();
    return this.http.get<User[]>(this.baseUrl, {headers});
  }

  get(id: any): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.baseUrl}/${id}`, {headers});
  }

  findByTitle(name: any): Observable<User> {
    const headers = this.getHeaders();
    return this.http.get<User>(`${this.baseUrl}/GetUserByName${name}`, {headers});
  }

  create(data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.baseUrl, data, {headers});
  }

  update(id: any, data: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/${id}`, data, {headers});
  }

  delete(id: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, {headers});
  }
}
