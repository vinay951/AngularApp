import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  standalone: true,
  imports: [CommonModule, LoadingComponent]
})
export class PaymentComponent {
  showRating = false;
  selectedRating = 0;
  private http: HttpClient;
  private router: Router;
  products: any[] = [];
  productIds: any[] = [];
isDataLoading: any;

  constructor(http: HttpClient, router: Router) {
    this.http = http;
    this.router = router;
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
    this.isDataLoading = true;
    this.http.post('https://onlinecompiler-710942123958.europe-west1.run.app/recordPurchase', payload).subscribe({
      next: (res) => {
        this.router.navigate(['/my-orders']);
        this.isDataLoading = false;
      },
      error: (err) => {
        // Handle error
        this.isDataLoading = false;
      }
    });
  }

  onCancel() {
    window.history.back();
  }
}
