import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '45d2ecaeb900459690151809250303'; // Replace with your WeatherAPI key
  private apiUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) {}

  // Fetch the weather data for the given lat and lng
  getWeather(lat: number, lng: number): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&q=${lat},${lng}&aqi=no`;
    return this.http.get<any>(url);
  }
}
