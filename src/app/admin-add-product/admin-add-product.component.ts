import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  productForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  apiUrl = 'http://localhost:8080';
  submitError = '';
  imageBase64: string | null = null;
    isDataLoading: any;
    userEmail: string = '';
    products: Product[] = [];
    editingProduct: Product | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient,) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
      // For demo, set userEmail here or get from auth service
      this.userEmail = sessionStorage.getItem('user') || '';
      if (this.userEmail) {
        this.loadProducts();
      }
    }

    loadProducts() {
      this.isDataLoading = true;
      this.http.get<Product[]>(`${this.apiUrl}/shop/products/email/${this.userEmail}`).subscribe({
        next: (data) => {
          this.products = data;
          this.isDataLoading = false;
        },
        error: (err) => {
          this.isDataLoading = false;
          console.error('Error loading products:', err);
        }
      });
    }

    confirmDelete(product: Product) {
      if (confirm(`Are you sure you want to delete '${product.name}'?`)) {
        this.deleteProduct(product);
      }
    }

    deleteProduct(product: Product) {
      this.isDataLoading = true;
      this.http.delete(`${this.apiUrl}/shop/delete/${product.id}`).subscribe({
        next: () => {
          this.isDataLoading = false;
        },
        error: (err) => {
          this.isDataLoading = false;
          alert('Failed to delete product.');
          console.error('Delete error:', err);
        }
      });
    }

    startEdit(product: Product) {
      this.editingProduct = { ...product };
      // Fill form with product values
      this.productForm.patchValue({
        name: product.name,
        brand: product.brand,
        rating: product.rating,
        price: product.price
      });
      this.imageBase64 = product.imageUrl;
    }

    cancelEdit() {
      this.editingProduct = null;
      this.productForm.reset();
      this.imageBase64 = null;
    }

    onSubmit() {
      if (this.productForm.invalid || !this.imageBase64) {
        this.submitError = !this.imageBase64 ? 'Please select an image.' : '';
        return;
      }
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = '';
      const newProduct: Product = {
        ...this.productForm.value,
        imageUrl: this.imageBase64,
        email: this.userEmail
      };
      this.isDataLoading = true;
      if (this.editingProduct) {
        // Edit mode
        this.http.put(`${this.apiUrl}/shop/update/${this.editingProduct.id}`, newProduct).subscribe({
          next: () => {
            this.loadProducts();
            this.submitSuccess = true;
            this.cancelEdit();
            this.isSubmitting = false;
            this.isDataLoading = false;
          },
          error: err => {
            this.submitError = 'Failed to update product.';
            this.isSubmitting = false;
            this.isDataLoading = false;
            console.error('Error updating product:', err);
          }
        });
      } else {
        // Add mode
        this.http.post(`${this.apiUrl}/shop/add`, newProduct).subscribe({
          next: () => {
            this.submitSuccess = true;
            this.productForm.reset();
            this.imageBase64 = null;
            this.isSubmitting = false;
            this.isDataLoading = false;
            this.loadProducts();
          },
          error: err => {
            this.submitError = 'Failed to add product.';
            this.isSubmitting = false;
            this.isDataLoading = false;
            console.error('Error adding product:', err);
          }
        });
      }
    }
  

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
function onImageSelected(event: Event | undefined, Event: { new(type: string, eventInitDict?: EventInit): Event; prototype: Event; readonly NONE: 0; readonly CAPTURING_PHASE: 1; readonly AT_TARGET: 2; readonly BUBBLING_PHASE: 3; }) {
    throw new Error('Function not implemented.');
}

