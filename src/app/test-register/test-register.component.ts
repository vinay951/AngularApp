import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Test, TestCase } from '../model';
import { LoadingComponent } from "../loading/loading.component";
import { TestCasesService } from '../service/run/test-cases.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private testService:TestCasesService,private router:Router,private toastr:ToastrService){
    this.isModalOpen = true; // Show popup by default for testing
  }


  // Handle form submission
  submitRegisterForm() {
    const test:Test = this.registerData;
    this.isDataLoading  = true;
    this.testService.createTestCase(test).subscribe(
      (response:any) => {
        this.isDataLoading = false;
        this.toastr.success("Test Case Added: "+test.name)
        this.isModalOpen = false; // Close popup only after successful submit
        if(this.router.url === '/test'){
          window.location.reload();
        }else{
          this.router.navigateByUrl('/test');
        }
      },
      (error:any) => {
        console.error('Error sending OTP:', error);
        this.toastr.error("Test Case failed To Add: "+test.name)
        this.isDataLoading = false;
      }
    );
  }

  closePopup() {
    this.isModalOpen = false;
  }

}
