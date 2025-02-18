import { Component } from '@angular/core';
import { ImageService } from '../image.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule, LoadingComponent]
})
export class UploadComponent {
  selectedImage: File | null = null;
  isDataLoading=false;
  deblurredImageUrl: string | null = null;
  selectedImageURl: string | null = null;
  errorMessage: string | null = null;  // Error message to show to user

  constructor(private imageService: ImageService) {}

  onImageSelect(event: any): void {
    this.selectedImage = event.target.files[0];
    if (event.target.files[0] && event.target.files[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImageURl = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUpload(): void {
    if (this.selectedImage) {
      this.isDataLoading=true;
      const formData = new FormData();
      formData.append('image', this.selectedImage);

      this.imageService.deblurImage(formData).subscribe({
        next: (response) => {
          const url = URL.createObjectURL(response);
          this.deblurredImageUrl = url;
          this.errorMessage = null;  // Clear any previous error message
          this.isDataLoading=false;
        },
        error: (err) => {
          this.isDataLoading=false;
          console.error(err);
          if (err.status === 400) {
            this.errorMessage = 'Invalid image format. Please upload a .jpg, .jpeg, or .png file.';
          } else if (err.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      });
    }
  }
}

