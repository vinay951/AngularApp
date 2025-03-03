declare var google: any;

import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteService } from '../services/maps/autocomplete.service';
import { GeocodingService } from '../services/maps/geocoding.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-maps',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit,AfterViewInit {
  ngOnInit(): void {
    // this.getLocation();
  }
  constructor(private autocompleteService: AutocompleteService,
    private geocodingService: GeocodingService,private cdr: ChangeDetectorRef
  ){

  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getLocation();
      this.cdr.detectChanges(); // Trigger change detection explicitly
    }, 100); // Delay by 100ms or adjust as needed
  }
  address: string = '';
  isDataLoading = false;
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
      this.isDataLoading = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success - User granted permission
          console.log('Location found:', position.coords.latitude, position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.isDataLoading = false;
          this.loadMap();
        },
        (error) => {
          this.isDataLoading = false;
          // Error - User denied permission or other issues
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            // Handle the case where the user denies location access
            alert("You have denied the location request. The default location will be used.");
          } else {
            // Handle other errors, such as timeout or unavailable location
            alert("An error occurred while fetching your location. The default location will be used.");
          }
          this.loadMap();  // Use the default location if there is an error
        },
        {
          enableHighAccuracy: true, // Ensure high accuracy (uses GPS if available)
          timeout: 5000, // Timeout after 30 seconds if no location is found
          maximumAge: 0 // No cached location (always get fresh data)
        }
      );
    } else {
      this.isDataLoading = false;
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
  const mapComp = new MapsComponent(this.autocompleteService, this.geocodingService,this.cdr);
  mapComp.loadMap();
};
