import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';  // You may need to install this module
import { Observable } from 'rxjs';
import { Login, ProfilePic, User } from '../model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://onlinecompiler-710942123958.europe-west1.run.app';  // Replace with your actual API
  private ipApiUrl = 'https://api.ipify.org?format=json'; // You can use other IP APIs

  constructor(private http: HttpClient) { }

  // Method to login
  login(login:Login): Observable<any> {
    return this.http.post(`${this.apiUrl}/userLogin`,login
    );
  }


  getIpAddress(): Observable<any> {
    return this.http.get(this.ipApiUrl);
  }

  // Method to register a new user
  register(user:User): Observable<any> {
    return this.http.post(`${this.apiUrl}/createUser`, user);
  }

  getUserProfile(email:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUserDetails/`+email);
  }
  updateUserProfile(user:User): Observable<any>{
    return this.http.patch(`${this.apiUrl}/userPatch`,user);
  }
  changePassword(login:Login): Observable<any>{
    return this.http.patch(`${this.apiUrl}/changePassword`,login);
  }
  deleteUser(email: string): Observable<any> {
    // Calling the Spring Boot backend to send the OTP
    return this.http.delete(this.apiUrl+'/delete/'+email);
  }
  getProfile(email: string): Observable<any> {
    return this.http.get(this.apiUrl+'/getPic/'+email);
  }
  uploadProfilePic(data:ProfilePic): Observable<any> {
    return this.http.post(this.apiUrl+'/profilePic', data);
  }
  faceIdCheck(email:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/faceid/`+email);
  }
  deleteFaceId(email:string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/faceid/delete/`+email);
  }
  toggleMode(email:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/toggleTheme/`+ email);
  }
  getMode(email:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getTheme/`+email);
  }
}
