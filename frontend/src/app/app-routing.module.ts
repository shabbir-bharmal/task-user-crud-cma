import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { LoginComponent } from './components/login-user/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Public route
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  { path: 'users/add', component: AddUserComponent, canActivate: [AuthGuard], pathMatch: 'full' },
  { path: 'users/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default to login
  { path: '**', redirectTo: 'login' }, // Catch-all for undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
