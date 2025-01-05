import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestCase } from '../../model';
@Injectable({
  providedIn: 'root'
})
export class TestCasesService {

  apiUrl = "https://selenium-testing-1055536593121.us-central1.run.app";
  apiUrlSpring = "https://backend-1055536593121.us-central1.run.app";


  constructor(private http:HttpClient) {
  }

  runTestProfile(email:string,test:TestCase){
    this.setTestCases(test);
    return this.http.get<any[]>(this.apiUrl+"/test/profile/"+email);
  }
  runTestChat(email:string){
    return this.http.get<any[]>(this.apiUrl+"/test/chat/"+email);
  }

  getAllTestCases(){
    return this.http.get<any[]>(this.apiUrlSpring+"/getAll");
  }

  setTestCases(test:TestCase){
    test.isLoading = true;
    return this.http.post<any[]>(this.apiUrlSpring+"/editTestCase",test);
  }
}
