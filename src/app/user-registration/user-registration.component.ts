// src/app/user-registration/user-registration.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { User } from '../model';
import { OtpComponent } from '../otp/otp.component';
import { OtpService } from '../service/otp.service';
import { LoadingComponent } from "../loading/loading.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  otpPopupVisible: boolean = false;
  isDataLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router,private userService:UserService,private otpService:OtpService
    ,private toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchingValidator });
  }

  passwordMatchingValidator(control: FormGroup): null | { passwordMismatch: boolean } {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    this.isDataLoading = true;
    const sent = await this.sendOtp(this.registrationForm.value.email);
    console.log(sent);
    if (this.registrationForm.valid && sent) {
      console.log(this.registrationForm.value);
      const user:User = new User(this.registrationForm.value.firstName,this.registrationForm.value.lastName,
        "1",this.registrationForm.value.email,this.registrationForm.value.password
      );
      console.log('User Registered:', user);
      this.isDataLoading = true;
      localStorage.setItem("userForRegister",JSON.stringify(user));
    }
  }
  showOtpPopup() {
    this.otpPopupVisible = true;
    return true;
  }
  async sendOtp(email:string): Promise<boolean> {
   let value:boolean = false;
   try{
      this.otpService.sendOtp(email).subscribe(
        (response:any) => {
          this.isDataLoading = false;
          this.toastr.success("OTP SENT")
          this.router.navigateByUrl("/otp");
          return true;
        },
        (error:any) => {
          console.error('Error sending OTP:', error);
          this.isDataLoading = false;
          this.toastr.error(error.error.responseMessage,"Try Again")
          return false;
        }
      );
      return true;
    } catch(error){
      return false;
    }
  }
}
