import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PredictionService } from '../prediction.service';
import { LoadingComponent } from "../loading/loading.component";
import { NotificationSendMessageService } from '../service/notification-send-message.service';

@Component({
  selector: 'app-bikebuyerprediction',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './bikebuyerprediction.component.html',
  styleUrl: './bikebuyerprediction.component.css'
})
export class BikebuyerpredictionComponent {
  isDataLoading = false;

  userData = {
    maritalStatus: 0,
    yearlyIncome: 0,
    children: 0,
    homeOwner: 0,
    cars: 0,
    age: 0
  };
  prediction: any;

  constructor(private apiService: PredictionService,private notificationService:NotificationSendMessageService) {}

  onSubmit() {
    const { maritalStatus, yearlyIncome, children, homeOwner, cars, age } = this.userData;
    this.isDataLoading = true;
    this.apiService.getPrediction(maritalStatus, yearlyIncome, children, homeOwner, cars, age)
      .subscribe(response => {
        this.prediction = response.message;
        console.log('Prediction received:', this.prediction);
        this.notificationService.showNotification('Prediction received:'+ this.prediction,localStorage.getItem("user")!);
        this.isDataLoading = false;
      }, error => {
        console.error('Error calling API:', error);
        this.isDataLoading = false;
      });
  }

}
