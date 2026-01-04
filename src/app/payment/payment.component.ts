import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentComponent {
  showRating = false;
  selectedRating = 0;
  private http: HttpClient;
  products: any[] = [];
  productIds: any[] = [];

  constructor(http: HttpClient) {
    this.http = http;
    // Get products from navigation state
    this.products = history.state?.products || [];
    this.productIds = this.products.map((p: any) => p.id);
  }

  get total(): number {
    return this.products.reduce((sum, p) => sum + (p.price || 0), 0);
  }

  onBuy() {
    const email = localStorage.getItem('user');
    const payload = { ids: this.productIds, email };
    this.http.post('https://your-api-endpoint.com/store-purchase', payload).subscribe({
      next: (res) => {
        this.showRating = true;
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  onCancel() {
    // Implement cancel logic, e.g., navigate away
  }

  setRating(rating: number) {
    this.selectedRating = rating;
    // Optionally, send rating to API for all products
    const email = localStorage.getItem('user');
    const payload = { ids: this.productIds, email, rating };
    this.http.post('https://your-api-endpoint.com/store-rating', payload).subscribe({
      next: (res) => {
        // Handle success (show message, etc.)
      },
      error: (err) => {
        // Handle error
      }
    });
  }
}
