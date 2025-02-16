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
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { TestRegisterComponent } from './test-register/test-register.component';
import { CodingComponent } from './coding/coding.component';
import { BikebuyerpredictionComponent } from './bikebuyerprediction/bikebuyerprediction.component';
import { StrangeComponent } from './strange/strange.component';
import { DynamicComponent } from './dynamic/dynamic.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent,canActivate:[loginGuard] },   // Route for login page
    { path: 'register', component: UserRegistrationComponent },
    { path: 'forgot', component: ForgotComponent }, // Route for register page
    { path: 'profile', component: ProfileComponent,canActivate:[authGuard]},
    { path: 'questions', component: CodingComponent,canActivate:[authGuard]},
    { path: 'home', component: HomeComponent,canActivate:[authGuard]},
    { path: 'compiler', component: CompilerComponent,canActivate:[authGuard]},
    { path: 'chatgpt', component: ChatComponent,canActivate:[authGuard]},
    {path:'test',component:TestcasesComponent,canActivate:[authGuard]},
    {path:'reports',component:TestReportsComponent,canActivate:[authGuard]},
    {path:'testRegister',component:TestRegisterComponent,canActivate:[authGuard]},
    { path: 'accessDenied', component: AccessDeniedComponent },
    { path: 'otp', component: OtpComponent},
    { path: 'strange', component: StrangeComponent,canActivate:[authGuard]},
    { path: 'dynamic', component: DynamicComponent,canActivate:[authGuard]},
    { path: "predict", component: BikebuyerpredictionComponent,canActivate:[authGuard]},
    { path: '**', redirectTo: '/home'}  // Default route, redirects to login
];
