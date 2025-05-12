import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../session/session.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-login-faceid',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
  templateUrl: './login-faceid.component.html',
  styleUrl: './login-faceid.component.css'
})
export class LoginFaceidComponent {
  @ViewChild('video', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  loginStatus: string = '';
  userId: string = '';
  faceidRegisterStatus: string = '';
  private stream: MediaStream | null = null;
  private faceImageBlob: Blob | null = null;
  showPopup: boolean = false;
  capturedImageUrl: string | null = null;
  isDataLoading=false;

  constructor(private http: HttpClient,private fb: FormBuilder, private router: Router,
      private session:SessionService) {}

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        if (this.videoRef && this.videoRef.nativeElement) {
          this.videoRef.nativeElement.srcObject = stream;
        }
      })
      .catch(() => {
        this.loginStatus = 'Unable to access camera.';
      });
  }

  ngAfterViewInit() {
    this.startCamera();
  }

  async captureFaceImage(): Promise<Blob | null> {
    if (this.videoRef && this.canvasRef) {
      const video = this.videoRef.nativeElement;
      const canvas = this.canvasRef.nativeElement;
      // Dynamically set canvas size to match video size (for mobile)
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return new Promise(resolve => {
          canvas.toBlob(blob => {
            if (blob) {
              // Revoke previous URL if exists
              if (this.capturedImageUrl) {
                URL.revokeObjectURL(this.capturedImageUrl);
              }
              this.capturedImageUrl = URL.createObjectURL(blob);
              this.showPopup = true;
            }
            resolve(blob);
          }, 'image/jpeg');
        });
      }
    }
    return null;
  }

  closePopup() {
    this.showPopup = false;
    if (this.capturedImageUrl) {
      URL.revokeObjectURL(this.capturedImageUrl);
      this.capturedImageUrl = null;
    }
  }

  async loginWithFaceId() {
    if (!this.userId) {
      this.loginStatus = 'Please enter your User ID.';
      return;
    }
    const blob = await this.captureFaceImage();
    if (!blob) {
      this.loginStatus = 'Unable to capture face image.';
      return;
    }
    const formData = new FormData();
    formData.append('email', this.userId);
    formData.append('faceImage', blob, 'face.jpg');
    this.isDataLoading=true
    this.http.post<any>('https://onlinecompiler-1080506539744.us-central1.run.app/api/faceid/login', formData).subscribe({
      next: (res) => {
        this.loginStatus = 'Face ID login successful (face image matched)';
        // Optionally, store JWT token from res if provided
        if (res.message === 'Face ID login successful (face image matched)') {
          localStorage.setItem("user",this.userId);
          this.session.setSessionData("Token",res.token);
          this.decodeJwtAndStore(res.token);
          this.router.navigateByUrl("/home");
        }
        this.isDataLoading=false
      },
      error: (err) => {
        this.isDataLoading=false;
        if (err.error?.message === 'Face ID already registered') {
          this.faceidRegisterStatus = 'Face ID already registered. Please use a different User ID.';
        } else if (err.error?.message.includes('face')) {
          this.faceidRegisterStatus = 'Face Not Detected';
        }else if (err.error?.message.includes('No value')) {
          this.faceidRegisterStatus = 'User Not Registered. Please Create Account';
        }
        else{
          this.loginStatus = err.error?.message || 'Face ID login failed.';
        }
      }
    });
  }

  async registerWithFaceId() {
    if (!this.userId) {
      this.faceidRegisterStatus = 'Please enter your User ID.';
      return;
    }
    const blob = await this.captureFaceImage();
    if (!blob) {
      this.faceidRegisterStatus = 'Unable to capture face image.';
      return;
    }
    this.isDataLoading=true;
    // For demo, use userId as both email and login
    const formData = new FormData();
    formData.append('email', this.userId);
    formData.append('login', this.userId);
    formData.append('faceImage', blob, 'face.jpg');
    this.http.post<any>('https://onlinecompiler-1080506539744.us-central1.run.app/api/faceid/register', formData).subscribe({
      next: (res) => {
        this.isDataLoading=false;
        this.faceidRegisterStatus = 'Face ID registration successful!';
      },
      error: (err) => {
        this.isDataLoading=false;
        if (err.error?.message === 'Face ID already registered') {
          this.faceidRegisterStatus = 'Face ID already registered. Please use a different User ID.';
        } else if (err.error?.message.includes('No value')) {
          this.faceidRegisterStatus = 'User Not Registered. Please Create Account';
        } else{
          this.faceidRegisterStatus = err.error?.message || 'Face ID registration failed.';
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
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
