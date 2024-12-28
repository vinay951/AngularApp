import { Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { OtpComponent } from './otp/otp.component';
import { ForgotComponent } from './forgot/forgot.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },   // Route for login page
    { path: 'register', component: UserRegistrationComponent },
    { path: 'forgot', component: ForgotComponent }, // Route for register page
    { path: 'profile', component: ProfileComponent,canActivate:[authGuard]},
    { path: 'home', component: HomeComponent,canActivate:[authGuard]},
    { path: 'otp', component: OtpComponent},
    { path: '', redirectTo: '/login', pathMatch: 'full' }  // Default route, redirects to login
];
