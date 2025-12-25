// shop.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, MatDialogModule, ProductDialogComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  isLoading = true;

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
  this.isLoading = true;

  this.http.get<Product[]>('/products.json').subscribe({
      next: data => {
        this.products = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load products.json', err);
        this.isLoading = false;
      }
    });


  this.isLoading = false;
}


  openProduct(product: Product): void {
    this.dialog.open(ProductDialogComponent, {
      width: '420px',
      data: product
    });
  }
}
