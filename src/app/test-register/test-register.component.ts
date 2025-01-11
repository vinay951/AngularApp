import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Test, TestCase } from '../model';
import { LoadingComponent } from "../loading/loading.component";
import { TestCasesService } from '../service/run/test-cases.service';

@Component({
  selector: 'app-test-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './test-register.component.html',
  styleUrl: './test-register.component.css'
})
export class TestRegisterComponent {


  isDataLoading = false;
  isModalOpen = false;

  registerData ={
    name:"",
    loading:false
  }

  constructor(private testService:TestCasesService){

  }


  // Handle form submission
  submitRegisterForm() {
    const test:Test = this.registerData;
    this.isDataLoading  = true;
    this.testService.createTestCase(test).subscribe(
      (response:any) => {
        this.isDataLoading = false;
        
      },
      (error:any) => {
        console.error('Error sending OTP:', error);
        this.isDataLoading = false;
      }
    );
   
  }

}
