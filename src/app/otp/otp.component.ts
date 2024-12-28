import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OtpService } from '../service/otp.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingComponent } from "../loading/loading.component";
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  standalone:true,
  imports: [ReactiveFormsModule, CommonModule, LoadingComponent]
})
export class OtpComponent {
  @Input() isOtp: boolean = false;
  @Input() emailFromForgot:string = "";
  @Output() successMessage = new EventEmitter<string>;
  otpForm: FormGroup;
  otpSent = false;
  isDataLoading = false;
  email: string = '';
  countdown: number = 60; // Initial 60 seconds for countdown
  timer: any;
  isTimerActive = false;

  constructor(
    private otpService: OtpService,
    private fb: FormBuilder, private router: Router,
    private userService:UserService,
    private toastr: ToastrService
  ) {
    this.otpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', Validators.required]
    });
    this.otpSent = true;
  }

  // Method to send OTP
  sendOtp(): void {
    console.log(this.otpForm.valid)
    if (!this.otpForm.get('email')?.invalid) {
      
      this.email = this.otpForm.value.email;
      this.otpService.sendOtp(this.email).subscribe(
        (response:any) => {
          this.otpSent = true;
          this.startTimer();
          console.log('OTP sent successfully:', response);
        },
        (error:any) => {
          console.error('Error sending OTP:', error);
        }
      );
    }
  }

  // Method to verify OTP
  verifyOtp(): void {
    this.isDataLoading = true;
    if (!this.otpForm.valid && !this.isOtp) {
      const otp = this.otpForm.value.otp;
      this.otpService.verifyOtp(JSON.parse(localStorage.getItem("userForRegister")??"").emailId, otp).subscribe(
        (response:any) => {
          if (response.responseMessage === "OTP Verified") {
            console.log('OTP verified successfully');
            this.userService.register(JSON.parse(localStorage.getItem("userForRegister")??"")).subscribe({
              next: (response: any) => {
                // On successful login, store the user info or token and navigate
                if(response.responseMessage === "User Created"){
                  this.router.navigateByUrl('/login');
                  localStorage.clear();
                } else{
                  this.toastr.error(response.responseMessage);
                }
                this.isDataLoading = false;
              },
              error: (err: any) => {
                console.log(err)
                this.toastr.error(err.error.message);
                this.isDataLoading = false;
              }
            });
          
            // Navigate to success page or dashboard
          } else {
            console.log('OTP verification failed');
            this.isDataLoading = false;
            this.toastr.error(response.responseMessage);
          }
        },
        (error:any) => {
          console.error('Error verifying OTP:', error);
          this.isDataLoading = false;
          this.toastr.error(error.error.responseMessage,"try again");
        }
      );
    }else if(this.isOtp && this.emailFromForgot!=undefined){
      this.otpService.verifyOtp(this.emailFromForgot, this.otpForm.value.otp).subscribe(
        (response:any) => {
          if (response.responseMessage === "OTP Verified") {
            console.log('OTP verified successfully');
            // Navigate to success page or dashboard
            this.successMessage.emit("true");
          } else {
            console.log('OTP verification failed');
            this.toastr.error(response.responseMessage);
          }
          this.isDataLoading = false;
        },
        (error:any) => {
          console.error('Error verifying OTP:', error);
          this.isDataLoading = false;
          this.toastr.error(error.error.responseMessage,"try again");
        }
      );
    }
  }

  // Start the 60 seconds timer
  startTimer() {
    this.isTimerActive = true;
    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timer);
        this.isTimerActive = false;
        this.countdown = 60; // Reset countdown after 60 seconds
      }
    }, 1000);
  }

  // Reset timer and resend OTP (optional)
  resendOtp() {
    this.countdown = 60;
    this.sendOtp();
  }
}
