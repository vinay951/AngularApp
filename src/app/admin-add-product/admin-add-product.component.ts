import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-add-product.component.html',
  styleUrls: ['./admin-add-product.component.css']
})
export class AdminAddProductComponent {
  productForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  imageBase64: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
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
      imageUrl: this.imageBase64
    };
    // Here you would typically POST to a backend API. For now, just log.
    this.http.post('/shop/add', newProduct).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.productForm.reset();
        this.imageBase64 = null;
        this.isSubmitting = false;
      },
      error: err => {
        this.submitError = 'Failed to add product.';
        this.isSubmitting = false;
      }
    });
  }
}
