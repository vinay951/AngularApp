declare var google: any; // Declare the google object

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteService } from '../services/maps/autocomplete.service';
import { GeocodingService } from '../services/maps/geocoding.service';

@Component({
  selector: 'app-maps',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit,AfterViewInit {
  ngOnInit(): void {
    // this.getLocation();
  }
  constructor(private autocompleteService: AutocompleteService,
    private geocodingService: GeocodingService){

  }
  ngAfterViewInit(): void {
    this.getLocation();
  }
  address: string = '';
  suggestions: any[] = [];
  errorMessage: string | null = null;
  defaultLat = 37.7749;
  defaultLng = -122.4194;
  // Properties to store current location
  lat: number = this.defaultLat;
  lng: number = this.defaultLng;

  onInputChange(): void {
    if (this.address.trim()) {
      this.autocompleteService
        .getSuggestions(this.address)
        .then((predictions) => {
          this.suggestions = predictions;
        })
        .catch((error) => {
          this.suggestions = [];
        });
    } else {
      this.suggestions = [];
    }
  }

  onSearch(suggestion: string): void {
    this.address = suggestion;
    this.suggestions = [];
    this.geocodingService
      .geocodeAddress(this.address)
      .then((result: any) => {
        console.log('Geocoding result:', result);
        this.lat = result.lat;
        this.lng = result.lng;
        this.loadMap();
      })
      .catch((error) => {
        this.errorMessage = error;
      });
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success - User granted permission
          console.log('Location found:', position.coords.latitude, position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.loadMap();
        },
        (error) => {
          // Error - User denied permission or other issues
          console.error('Error getting location:', error);
          // If an error occurs (e.g., user denies location), use the default location
          this.loadMap();
        },
        {
          enableHighAccuracy: true, // Ensure high accuracy (uses GPS if available)
          timeout: 10000, // Timeout after 10 seconds if no location is found
          maximumAge: 0 // No cached location (always get fresh data)
        }
      );
    } else {
      // Geolocation is not supported by this browser
      console.warn('Geolocation is not supported by this browser.');
      this.loadMap();  // Use the default location if geolocation is not supported
    }
  }

  // Function to load the map with the user's location or default location
  loadMap(): void {
    console.log('Loading map with lat:', this.lat, 'lng:', this.lng); // Log lat/lng
    const mapElement = document.getElementById('map') as HTMLElement;

    // Ensure mapElement is not null
    if (mapElement) {
      const mapProperties = {
        center: new google.maps.LatLng(this.lat, this.lng), // Use dynamic or default location
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      // Create the map instance
      const map = new google.maps.Map(mapElement, mapProperties);

      // Add a marker at the location
      new google.maps.Marker({
        position: mapProperties.center,
        map: map,
        title: 'Current Location'
      });
    } else {
      console.error('Map container element not found');
    }
  }

}
// Ensure the initMap function is available globally
(window as any).initMap = function() {
  const mapComp = new MapsComponent(this.autocompleteService, this.geocodingService);
  mapComp.loadMap();
};
