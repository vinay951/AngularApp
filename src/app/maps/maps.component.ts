declare var google: any;

import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteService } from '../services/maps/autocomplete.service';
import { GeocodingService } from '../services/maps/geocoding.service';
import { LoadingComponent } from "../loading/loading.component";
import { WeatherService } from '../weather.service';

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
    private geocodingService: GeocodingService,private cdr: ChangeDetectorRef,private weatherService:WeatherService
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
  isHovered = false;
  defaultLat = 37.7749;
  weatherData: any = null;
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
          console.log(position);
          this.lng = position.coords.longitude;
          this.loadMap();
          this.isDataLoading = false;
        },
        (error) => {
          this.isDataLoading = false;
          // Error - User denied permission or other issues
          console.error('Error getting location:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert("You have denied location access. Default location will be used.");
          } else {
            alert("An error occurred while fetching your location. Default location will be used.");
          }
          this.loadMap();  // Fallback to default location
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Timeout after 10 seconds if no location is found
          maximumAge: 0
        }
      );
    } else {
      this.isDataLoading = false;
      // Geolocation is not supported by this browser
      alert('Geolocation is not supported by this browser.');
      this.loadMap();  // Fallback to default location
    }
  }
  

  // Function to load the map with the user's location or default location
  loadMap(): void {
    this.weatherService.getWeather(this.lat,this.lng).subscribe(
      (response:any) => {
        this.weatherData = response;
      },
      (error:any) => {
        console.error('Error getting weather:', error);
      }
    );
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
  const mapComp = new MapsComponent(this.autocompleteService, this.geocodingService,this.cdr,this.weatherService);
  mapComp.loadMap();
};
