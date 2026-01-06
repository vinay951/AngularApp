// cart-dialog.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../service/cart.service';
import { Product } from '../model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent {
  private cart = inject(CartService);
  private router = inject(Router);
  items: Product[] = this.cart.getItems();
  darkMode = false;

  constructor(private dialogRef: MatDialogRef<CartDialogComponent>) {
    // Detect dark mode from body or html
    this.darkMode = document.body.classList.contains('dark-mode') || document.documentElement.classList.contains('dark-mode');
    setTimeout(() => {
      const dialog = document.querySelector('.cart-big');
      if (dialog && this.darkMode) {
        dialog.classList.add('dark-mode');
      }
    }, 0);
  }

  get total(): number {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }

  checkout(): void {
    this.dialogRef.close();
    // Navigate to checkout with cart items
    this.router.navigate(['/checkout'], { state: { products: this.items } });
  }
}
