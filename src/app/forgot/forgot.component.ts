import { Component, OnInit, Output } from '@angular/core';
import { LoadingComponent } from "../loading/loading.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpComponent } from "../otp/otp.component";
import { Login } from '../model';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OtpService } from '../service/otp.service';

@Component({
  selector: 'app-forgot',
  imports: [LoadingComponent, CommonModule, ReactiveFormsModule, OtpComponent],
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css'
})
export class ForgotComponent implements OnInit{

  constructor(
    private fb: FormBuilder,
    private userService:UserService,
    private toastr:ToastrService,
    private router:Router,
    private otpService:OtpService
  ){

  }
  ngOnInit(): void {
    this.initializeForm();
  }
  isDataLoading = false;
  isPasswordChangeVisible = false;
  profileForm!: FormGroup;
  readonlyValue = false;
  anotherComponent = false;
  success = false;

  // Toggle visibility of the password change section
  togglePasswordChange() {
    this.isPasswordChangeVisible = !this.isPasswordChangeVisible;
  }
  initializeForm() {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: this.readonlyValue }, [Validators.required, Validators.email]],
      newPassword: ['', Validators.minLength(8)],
      confirmPassword: ['']
    });
  }
  onSubmit(){
    this.isDataLoading = true;
    if (!this.profileForm.get('email')?.invalid) {
      console.log("email"+this.profileForm.value.email)
      this.otpService.sendOtp(this.profileForm.value.email).subscribe(
        (response:any) => {
          this.anotherComponent = true;
          this.isDataLoading = false;
          this.readonlyValue = true;
          console.log('OTP sent successfully:', response);
        },
        (error:any) => {
          console.error('Error sending OTP:', error.error.message);
          this.isDataLoading = false;
          if(error.error.message.includes("otp limit")){
            this.toastr.error("Limit Over Please Change Your Password tomorrow");
          }
          
        }
      );
    }
  }
  changePassword(){
    if (this.profileForm.value.newPassword !== this.profileForm.value.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    this.isDataLoading = true;
    const email = this.profileForm.value.email;
    const login:Login = new Login(email==undefined?"":email,this.profileForm.value.newPassword)
    this.userService.changePassword(login).subscribe(
      (response:any) => {
        if(response.responseMessage === "Success"){
          this.toastr.success('Password changed successfully');
          localStorage.clear();
          this.router.navigateByUrl('/login');
        }
        this.isDataLoading = false;
      },
      (error:any) => {
        this.toastr.error("Account Not Found","Try Again");
        console.error('Error changing password:', error);
        this.isDataLoading = false;
      }
    );

  }
  receiveMessage(childMessage:string){
    console.log(childMessage+"child message");
    if(childMessage=="true"){
      this.anotherComponent = false;
      this.togglePasswordChange();
      this.success = true;
      this.readonlyValue = true;
    }else{
      this.success = false;
    }
  }
}
