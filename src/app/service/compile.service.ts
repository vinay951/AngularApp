import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompileService {

  private apiUrl = 'http://localhost:8080';  // Spring Boot backend URL

  constructor(private http: HttpClient) { }

  executeCode(code: string, language: string): Observable<any> {
    const requestData = { code, language };
    return this.http.post<any>(this.apiUrl+"/compile", requestData);
  }
}
