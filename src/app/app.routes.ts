import { Routes } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth.guard';
import { OtpComponent } from './otp/otp.component';
import { ForgotComponent } from './forgot/forgot.component';
import { CompilerComponent } from './compiler/compiler.component';
import { ChatComponent } from './chat/chat.component';
import { loginGuard } from './login.guard';
import { TestcasesComponent } from './testcases/testcases.component';
import { TestReportsComponent } from './test-reports/test-reports.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent,canActivate:[loginGuard] },   // Route for login page
    { path: 'register', component: UserRegistrationComponent },
    { path: 'forgot', component: ForgotComponent }, // Route for register page
    { path: 'profile', component: ProfileComponent,canActivate:[authGuard]},
    { path: 'home', component: HomeComponent,canActivate:[authGuard]},
    { path: 'compiler', component: CompilerComponent,canActivate:[authGuard]},
    { path: 'chatgpt', component: ChatComponent,canActivate:[authGuard]},
    {path:'test',component:TestcasesComponent,canActivate:[authGuard]},
    {path:'reports',component:TestReportsComponent,canActivate:[authGuard]},
    { path: 'otp', component: OtpComponent},
    { path: '**', redirectTo: '/home'}  // Default route, redirects to login
];
