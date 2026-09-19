import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  apiUrl = "http://localhost:8080";

  constructor(private http:HttpClient) { }


  getRandomQuestion() {
    return this.http.get<any[]>(this.apiUrl+"/api/questions/random");
  }

  submitSolution(payload:any,question:any) {
    return this.http.post<any[]>(this.apiUrl+"/api/submit-code/"+question.text,payload);
  }
}
