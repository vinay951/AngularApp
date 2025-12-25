// product-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../model';
import { CartService } from '../service/cart.service';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public product: Product,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    private cart: CartService
  ) {}

  addToCart(): void {
    // call cart service here
    this.cart.addToCart(this.product);
    this.dialogRef.close({ action: 'add-to-cart' });
  }

  buyNow(): void {
    // call checkout / navigate
    this.dialogRef.close({ action: 'buy-now', product: this.product });
  }
}
