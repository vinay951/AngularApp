import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  // Define the base URL for the Google Places API
  private baseUrl = 'https://onlinecompiler-1080506539744.us-central1.run.app';

  constructor(private http: HttpClient) {}

  getNearbyHotels(lat: number, lng: number, radius: number = 5000): Observable<any> {
    return this.http.get(this.baseUrl+'/api/places/nearby', {
      params: {
        lat: lat.toString(),
        lng: lng.toString(),
        type: 'restaurant'
      }
    })
  }
}
