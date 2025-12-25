// cart-dialog.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../service/cart.service';
import { Product } from '../model';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent {
  private cart = inject(CartService);
  items: Product[] = this.cart.getItems();

  constructor(private dialogRef: MatDialogRef<CartDialogComponent>) {}

  get total(): number {
    return this.items.reduce((sum, p) => sum + p.price, 0);
  }

  checkout(): void {
    // implement checkout
    this.dialogRef.close({ action: 'checkout' });
  }
}
