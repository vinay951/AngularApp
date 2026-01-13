
import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent]
})
export class MyOrdersComponent {
  orders: any[] = [];
  userEmail: string | null = null;
  comments: { [orderId: string]: string } = {};
  ratings: { [orderId: string]: number } = {};
  submitting: { [orderId: string]: boolean } = {};
isDataLoading: any;
  darkMode = false;
  searchTerm: string = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.userEmail = localStorage.getItem('user');
    this.darkMode = document.body.classList.contains('dark-mode');
    const pref = localStorage.getItem('theme');
    if (pref === 'dark') {
      document.body.classList.add('dark-mode');
      this.darkMode = true;
    } else if (pref === 'light') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      this.darkMode = false;
    }
    this.fetchOrders();
  }
isStarSelected(orderId: any, star: number): boolean {
    return (this.ratings[orderId] || 0) >= star;
  }
  fetchOrders() {
    if (!this.userEmail) return;
    this.isDataLoading = true;
    this.http.get<any[]>(`https://onlinecompiler-710942123958.europe-west1.run.app/getUserOrders/${this.userEmail}`).subscribe({
      next: (data) => {
        // Format base64 imageUrl for each order and initialize ratings/comments
        this.orders = (data || []).map((order: any) => {
          let img = order.shop?.imageUrl || '';
          if (img && !img.startsWith('data:image/')) {
            img = 'data:image/jpeg;base64,' + img;
          }
          // Initialize ratings/comments from API if present
          const uniqueId = order.productBuy?.uniqueId;
          if (uniqueId) {
            this.ratings[uniqueId] = order.productBuy?.rating || 0;
            this.comments[uniqueId] = order.productBuy?.comments || '';
          }
          return {
            ...order,
            shop: { ...order.shop, imageUrl: img }
          };
        });
        this.isDataLoading = false;
      },
      error: (err) => {
        // Handle error
        this.isDataLoading = false;
      }
    });
  }

  setRating(orderId: any, rating: number) {
    this.ratings = { ...this.ratings, [orderId]: rating };
    this.cdr.markForCheck();
  }

  setComment(orderId: any, comment: string) {
    this.comments[orderId] = comment;
  }

  submitRating(orderId: any) {
    this.submitting[orderId] = true;
    const payload = {
      id:orderId,
      email: this.userEmail,
      rating: this.ratings[orderId],
      comments: this.comments[orderId] || ''
    };
    this.isDataLoading = true;
    this.http.post('https://onlinecompiler-710942123958.europe-west1.run.app/recordRating', payload).subscribe({
      next: (res) => {
        this.submitting[orderId] = false;
        this.isDataLoading = false;
        // Optionally show a success message or update UI
      },
      error: (err) => {
        this.submitting[orderId] = false;
        this.isDataLoading = false;
        // Handle error
      }
    });
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  clearSearch() {
    this.searchTerm = '';
  }

  get displayedOrders() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    if (!term) return this.orders;
    return this.orders.filter((o: any) => {
      const name = (o.shop?.name || '').toLowerCase();
      const brand = (o.shop?.brand || '').toLowerCase();
      const id = (o.productBuy?.uniqueId || '').toLowerCase();
      return name.includes(term) || brand.includes(term) || id.includes(term);
    });
  }
}
