// cart-dialog.component.ts
import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../service/cart.service';
import { Product } from '../model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent implements OnDestroy {
  private cart = inject(CartService);
  private router = inject(Router);
  items: Product[] = this.cart.getItems();
  darkMode = false;
  private sub: Subscription | null = null;

  constructor(private dialogRef: MatDialogRef<CartDialogComponent>) {
    // Detect dark mode from body or html
    this.darkMode = document.body.classList.contains('dark-mode') || document.documentElement.classList.contains('dark-mode');
    setTimeout(() => {
      const dialog = document.querySelector('.cart-big');
      if (dialog && this.darkMode) {
        dialog.classList.add('dark-mode');
      }
    }, 0);

    // keep items in sync with cart service
    this.sub = this.cart.cartCount$.subscribe(() => {
      this.items = this.cart.getItems();
    });
  }

  get total(): number {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }

  checkout(): void {
    this.dialogRef.close();
    // Navigate to checkout with cart items
    this.router.navigate(['/checkout'], { state: { products: this.items } });
  }

  closeCart(): void {
    this.dialogRef.close();
  }

  removeFromCart(product: Product): void {
    this.cart.deleteFromCart(product.id).subscribe(() => {
      // items will be updated by subscription; but refresh now as well
      this.items = this.cart.getItems();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
