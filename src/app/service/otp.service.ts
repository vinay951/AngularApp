import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  
  private apiUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) {}

  // Request to send OTP to the user (backend API)
  sendOtp(email: string): Observable<any> {
    // Calling the Spring Boot backend to send the OTP
    return this.http.post(this.apiUrl+'/otp/send',email);
  }



  // Verify OTP entered by the user
  verifyOtp(email: string,otp:string):Observable<any>{
    return this.http.post(this.apiUrl+'/otpVerify', { email,otp });
  }

}
