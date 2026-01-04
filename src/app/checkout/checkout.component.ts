import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe]
})
export class CheckoutComponent {
  product: any = null;
  products: any[] = [];

  constructor(private router: Router) {
    // Get product or products from navigation state
    this.product = history.state?.product || null;
    this.products = history.state?.products || (this.product ? [this.product] : []);
  }

  goToPayment() {
    // Pass products to payment page
    this.router.navigate(['/payment'], { state: { products: this.products } });
  }
}
