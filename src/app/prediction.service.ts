import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  baseUrl = 'https://selenium-710942123958.europe-west1.run.app/prediction';

  constructor(private http:HttpClient) { }

  getPrediction(maritalStatus: number, yearlyIncome: number, children: number, homeOwner: number, cars: number, age: number): Observable<any> {
    const url = `${this.baseUrl}/${maritalStatus}/${yearlyIncome}/${children}/${homeOwner}/${cars}/${age}`;
    return this.http.get<any>(url);
  }
}
