import { Component, Input, OnInit } from '@angular/core';
import { GooglePlacesService } from '../../services/google-places.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule]
})
export class HotelListComponent implements OnInit {
  hotels: any[] = [];
  lat!: number ;  // Example: San Francisco
  lng!: number;
  Math: any;

  constructor(private googlePlacesService: GooglePlacesService) {}

  ngOnInit(): void {
    this.lat=parseFloat(localStorage.getItem('lat')!);
    this.lng=parseFloat(localStorage.getItem('lng')!);
    this.getHotels();
  }
  getHotels(): void {
    this.googlePlacesService.getNearbyHotels(this.lat, this.lng).subscribe(response => {
      this.hotels = response.results;
    });
  }
  
}
