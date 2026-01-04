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

  constructor(private dialogRef: MatDialogRef<CartDialogComponent>) {}

  get total(): number {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }

  checkout(): void {
    this.dialogRef.close();
    // Navigate to checkout with cart items
    this.router.navigate(['/checkout'], { state: { products: this.items } });
  }
}
