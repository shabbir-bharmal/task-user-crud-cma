import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  baseUrl = 'https://localhost:7077/api';
  httpOptions: any = {
    withCredentials : true,
    observe: 'response' as 'response'
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      name: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    if(this.authService.isLoggedIn()) {
        this.router.navigate(['/users']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { name, password } = this.loginForm.value;
      
      this.http.post(this.baseUrl + '/Auth/login', { email: name, password: password }, { withCredentials: true }).subscribe(
        (res: any) => {
          // Successful login
          this.authService.login(res?.token)
          window.location.href = '/users';
        },
        (error) => {
          this.loginError = 'Invalid credentials or server error';
          console.error('Login error:', error);
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}