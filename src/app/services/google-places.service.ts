import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private apiKey = 'AIzaSyCbL-ZWgka-3ntOYiSt48hRE4r-vphpvNs';
  private baseUrl = 'https://maps.googleapis.com';

  constructor(private http: HttpClient) {}

  getNearbyHotels(lat: number, lng: number, radius: number = 5000): Observable<any> {
    const url = this.baseUrl+`/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
