import { Component, Input, OnInit } from '@angular/core';
import { GooglePlacesService } from '../../services/google-places.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoadingComponent]
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  lat!: number ;  // Example: San Francisco
  lng!: number;
  Math: any;
isDataLoading = false;

  constructor(private googlePlacesService: GooglePlacesService) {}

  ngOnInit(): void {
    this.lat=parseFloat(localStorage.getItem('lat')!);
    this.lng=parseFloat(localStorage.getItem('lng')!);
    this.getHotels();
  }
  getHotels(): void {
    this.isDataLoading = true;
    this.googlePlacesService.getNearbyHotels(this.lat, this.lng).subscribe(response => {
      this.hotels = response.results;
      this.isDataLoading = false;
    });
  }
  createStars(rating: number) {
    return new Array(Math.round(rating)); // Create an array with the number of stars
  }
  
}
