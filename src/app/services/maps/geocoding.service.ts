// src/app/services/geocoding.service.ts
import { Injectable } from '@angular/core';

declare var google: any;  // Declare google as a global variable

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private geocoder: any;

  constructor() {
    this.geocoder = new google.maps.Geocoder();
  }

  geocodeAddress(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.geocoder.geocode({ address: address }, (results: any, status: string) => {
        if (status === 'OK') {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          resolve({ lat, lng });
        } else {
          reject(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    });
  }
}
