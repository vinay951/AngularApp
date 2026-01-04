import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MyOrdersComponent {
  orders: any[] = [];
  userEmail: string | null = null;

  constructor(private http: HttpClient) {
    this.userEmail = localStorage.getItem('user');
    this.fetchOrders();
  }

  fetchOrders() {
    if (!this.userEmail) return;
    this.http.get<any[]>(`https://your-api-endpoint.com/orders?email=${this.userEmail}`).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        // Handle error
      }
    });
  }

  setRating(orderId: any, rating: number) {
    this.http.post('https://your-api-endpoint.com/store-rating', { orderId, email: this.userEmail, rating }).subscribe({
      next: (res) => {
        // Optionally update UI or show message
      },
      error: (err) => {
        // Handle error
      }
    });
  }
}
