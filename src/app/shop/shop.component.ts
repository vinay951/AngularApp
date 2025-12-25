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

  // static mock data for now
  this.products = [
    {
      id: 'p1',
      name: 'Wireless Headphones',
      brand: 'AudioPro',
      imageUrl: 'https://via.placeholder.com/300x200?text=Headphones',
      rating: 4.5,
      price: 2999
    },
    {
      id: 'p2',
      name: 'Gaming Mouse',
      brand: 'ProGamer',
      imageUrl: 'https://via.placeholder.com/300x200?text=Mouse',
      rating: 4.2,
      price: 1499
    },
    {
      id: 'p3',
      name: 'Mechanical Keyboard',
      brand: 'KeyMaster',
      imageUrl: 'https://via.placeholder.com/300x200?text=Keyboard',
      rating: 4.8,
      price: 3999
    }
  ];

  this.isLoading = false;
}


  openProduct(product: Product): void {
    this.dialog.open(ProductDialogComponent, {
      width: '420px',
      data: product
    });
  }
}
