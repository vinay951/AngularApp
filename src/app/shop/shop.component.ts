// shop.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../model';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, ProductDialogComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {
  private http = inject(HttpClient);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  products: Product[] = [];
  isLoading = true;
  page = 0;
  size = 12;
  totalPages = 1;
  searchValue = '';

  constructor() {
    this.loadProducts(this.page, this.size);
  }

  loadProducts(page: number, size: number, search: string = ''): void {
    this.isLoading = true;
    let url = `https://onlinecompiler-710942123958.europe-west1.run.app/shop/products/${page}/${size}`;
    if (search && search.trim() !== '') {
      url += `?search=${encodeURIComponent(search.trim())}`;
    }
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.products = (data.content || data).map((p: any) => {
          let img = p.imageUrl || '';
          // If already a data URL, use as is. Otherwise, prepend correct prefix.
          if (img && !img.startsWith('data:image/')) {
            // Try to detect type (png/jpg)
            let prefix = img.charAt(0) === '/' ? 'data:image/jpeg;base64,' : 'data:image/png;base64,';
            img = prefix + img;
          }
          return { ...p, imageUrl: img };
        });
        if(data.length == 12){
          this.totalPages += 1;
        } else{
          this.totalPages = 1;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.isLoading = false;
      }
    });
  }

  buyNow(product: Product) {
    // Navigate to checkout page, passing product info if needed
    this.router.navigate(['/checkout'], { state: { product } });
  }

  nextPage() {
    if (this.page < this.totalPages - 1) {
      this.page++;
      this.loadProducts(this.page, this.size, this.searchValue);
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page--;
      this.loadProducts(this.page, this.size, this.searchValue);
    }
  }

  onSearch() {
    this.page = 0;
    this.loadProducts(this.page, this.size, this.searchValue);
  }


  openProduct(product: Product): void {
    this.dialog.open(ProductDialogComponent, {
      width: '420px',
      data: product
    });
  }
}
