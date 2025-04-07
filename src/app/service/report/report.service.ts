import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'https://onlinecompiler-1080506539744.us-central1.run.app/reports/top5'; // Spring Boot API endpoint

  constructor(private http: HttpClient) { }

  // Fetch the top 5 HTML reports from the backend
  getTop5Reports(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
