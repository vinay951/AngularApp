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
import { UploadComponent } from './upload/upload.component';
import { MapsComponent } from './maps/maps.component';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { LoginFaceidComponent } from './login-faceid/login-faceid.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { GameComponent } from './game/game.component';
import { ShopComponent } from './shop/shop.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent,canActivate:[loginGuard],title: 'Login' },   // Route for login page
    { path: 'login-faceid', component: LoginFaceidComponent ,title: 'Login Face ID'}, // Face ID login route
    { path: 'register', component: UserRegistrationComponent,title: 'Register' }, // Route for register page
    { path: 'forgot', component: ForgotComponent, title: 'Forgot Password' }, // Route for register page
    { path: 'profile', component: ProfileComponent,canActivate:[authGuard],title: 'Profile',data: { isChangePassword: false } }, // Route for profile page
    { path: 'questions', component: CodingComponent,canActivate:[authGuard],title: 'Coding Questions' },
    { path: 'home', component: HomeComponent,canActivate:[authGuard],title: 'Home' }, // Route for home page
    { path: 'compiler', component: CompilerComponent,canActivate:[authGuard],title: 'Compiler' },
    { path: 'chatgpt', component: ChatComponent,canActivate:[authGuard],title: 'ChatGPT' },
    {path:'test',component:TestcasesComponent,canActivate:[authGuard],title: 'Test Cases' },
    {path:'reports',component:TestReportsComponent,canActivate:[authGuard],title: 'Test Reports' },
    {path:'testRegister',component:TestRegisterComponent,canActivate:[authGuard],title: 'Test Registration' },
    { path: 'accessDenied', component: AccessDeniedComponent    ,title: 'Access Denied' },
    { path: 'otp', component: OtpComponent ,title: 'OTP Verification'},
    { path:'changePassword', component:ProfileComponent,canActivate:[authGuard], title: 'Change Password',data: { isChangePassword: true } },
    { path: 'strange', component: StrangeComponent,canActivate:[authGuard],title: 'Strange' },
    { path: 'dynamic', component: DynamicComponent,canActivate:[authGuard],title: 'Dynamic' },
    { path: "predict", component: BikebuyerpredictionComponent,canActivate:[authGuard], title: 'Bike Buyer Prediction' },
    { path: 'unblur', component: UploadComponent,canActivate:[authGuard],  title: 'Image Unblur' },
    { path: 'maps', component: MapsComponent,canActivate:[authGuard], title: 'Maps' },
    { path: 'hotels', component: HotelListComponent,canActivate:[authGuard], title: 'Hotel List' },
    { path: 'game', component: GameComponent,canActivate:[authGuard], title: 'Game' },
    { path: 'shop', component: ShopComponent, canActivate:[authGuard], title: 'Shop' },
    { path: 'page-not-found', component: PageNotFoundComponent,title: 'Page Not Found' },  // Default route
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default route
    { path: '**', redirectTo: '/page-not-found'}  // Default route, redirects to login
];
