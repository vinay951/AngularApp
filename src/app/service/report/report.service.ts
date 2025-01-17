import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:8080/reports/top5'; // Spring Boot API endpoint

  constructor(private http: HttpClient) { }

  // Fetch the top 5 HTML reports from the backend
  getTop5Reports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
