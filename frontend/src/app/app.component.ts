import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isLoggedIn: boolean = false;
  constructor(
    private userService: UserService
    , private authService: AuthService
    , private router: Router
    , private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log(this.isLoggedIn)
    this.cdr.markForCheck();
  }
  title = 'Angular 17 Crud example';

  onLogout(): void{
    localStorage.removeItem('authToken'); 
    window.location.reload();
  }
}
