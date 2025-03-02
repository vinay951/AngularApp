declare var google: any; // Declare google as a global variable

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  private autocompleteService: any;

  constructor() {
    this.loadGoogleMapsApi().then(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
    }).catch(() => {
      console.error('Google Maps API is not loaded');
    });
  }

  private loadGoogleMapsApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_CatR5SwRN9ORXwlSsledtBm4yXZt6JU&loading=async&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      }
    });
  }

  getSuggestions(query: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (query.trim().length > 0 && this.autocompleteService) {
        this.autocompleteService.getPlacePredictions(
          { input: query },
          (predictions: any[], status: string) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            } else {
              reject('No suggestions available.');
            }
          }
        );
      } else {
        reject('Google Maps API or Autocomplete service is not available.');
      }
    });
  }
}
