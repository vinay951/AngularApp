import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // You may need to install this module
import { Observable } from 'rxjs';
import { Login, ProfilePic, User } from '../model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'https://onlinecompiler-1080506539744.us-central1.run.app';  // Replace with your actual API
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
  
}
