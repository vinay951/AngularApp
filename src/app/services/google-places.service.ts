import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesService {
  private apiKey = 'AIzaSyATtUTVEecxD8DgR4YtSRZlOA4kC-7Zh4U';
  private baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  constructor(private http: HttpClient) {}

  getNearbyHotels(lat: number, lng: number, radius: number = 5000): Observable<any> {
    const url = `${this.baseUrl}?location=${lat},${lng}&radius=${radius}&type=lodging&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
