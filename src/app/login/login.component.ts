import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { Login } from '../model';
import { ToastrService } from 'ngx-toastr';
import { LoadingComponent } from "../loading/loading.component";
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isDataLoading = false;
  uniqueName: string = '';

  constructor(private fb: FormBuilder,private userService:UserService, private router: Router,private toastr: ToastrService
    ,private session:SessionService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  skip(){
    this.isDataLoading = true;
    this.userService.getIpAddress().subscribe({
      next: (response: any) => {
        console.log(response);
        localStorage.setItem("user",this.generateUniqueName(response.ip));
        this.router.navigateByUrl("/home")
        this.isDataLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isDataLoading = false;
        this.toastr.error(err.error.responseMessage,"Try Again");
      }
    });
  }
  generateUniqueName(ip: string): string {
    const ipParts = ip.split('.'); // Split the IP into parts (e.g., '192.168.1.1')
    
    // Convert each numeric part to a corresponding alphabetic string
    const alphabeticParts = ipParts.map(part => this.convertToAlphabets(parseInt(part)));

    return `User-${alphabeticParts.join('-')}`; // Join the parts with hyphens
  }

  // Convert a numeric value (0-255) to corresponding alphabetic string
  convertToAlphabets(number: number): string {
    // Map the number to a range of alphabets (e.g., 0 -> A, 1 -> B, ..., 255 -> Z)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    // Split number into letters (for example: 26 -> AA, 27 -> AB, etc.)
    while (number >= 0) {
      result = alphabet[number % 26] + result;
      number = Math.floor(number / 26) - 1;
      if (number < 0) break;
    }
    
    // Ensure the result is exactly 2 characters (for instance, 'A' -> 'AA')
    return result.padStart(2, 'A');
  }

  onSubmit(): void {
    this.isDataLoading = true;
    if(this.loginForm.valid) {
      const login:Login = new Login(this.loginForm.value.username,this.loginForm.value.password);
      this.userService.login(login).subscribe({
        next: (response: any) => {
          console.log(response);
          if(response.responseMessage==="Success"){
            localStorage.setItem("user",this.loginForm.value.username);
            this.session.setSessionData("Token",response.token);
            this.decodeJwtAndStore(response.token);
            this.isDataLoading = false;
            this.router.navigateByUrl("/home")
          } else{
            this.toastr.error(response.responseMessage,"Try Again");
            this.isDataLoading = false;
          }
        },
        error: (err: any) => {
          console.log(err);
          this.isDataLoading = false;
          this.toastr.error(err.error.responseMessage,"Try Again");
        }
      });
    }
  }

  // Method to decode JWT without any dependencies
  decodeJwt(jwtToken: string): any {
    try {
      // JWT token has three parts: header, payload, and signature
      const base64Url = jwtToken.split('.')[1]; // The payload part is in the middle
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // URL-safe base64 decoding
      const jsonPayload = atob(base64); // Decode the base64 string into a JSON string
      return JSON.parse(jsonPayload); // Parse the JSON string into an object
    } catch (error) {
      console.error('Invalid JWT token', error);
      return null;
    }
  }

  // Method to decode JWT and store the decoded values in sessionStorage
  decodeJwtAndStore(jwtToken: string): void {
    const decodedToken = this.decodeJwt(jwtToken);
    if (decodedToken) {
      // Store the entire decoded token in sessionStorage
      sessionStorage.setItem('decodedToken', JSON.stringify(decodedToken));

      // Store specific values like userId, username, etc.
      sessionStorage.setItem('user', decodedToken.sub || '');
      sessionStorage.setItem('expire', decodedToken.exp || '');
    }
  }

  // Method to retrieve the decoded JWT from sessionStorage
  getDecodedToken(): any {
    const decodedToken = sessionStorage.getItem('decodedToken');
    return decodedToken ? JSON.parse(decodedToken) : null;
  }
}
