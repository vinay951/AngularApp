import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestCasesService {

  apiUrl = "https://selenium-testing-1055536593121.us-central1.run.app";

  constructor(private http:HttpClient) { }

  runTestProfile(email:string){
    return this.http.get<any[]>(this.apiUrl+"/test/profile/"+email);
  }
  runTestChat(email:string){
    return this.http.get<any[]>(this.apiUrl+"/test/chat/"+email);
  }
}
