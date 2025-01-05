import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TestCasesService } from '../service/run/test-cases.service';
import {ToastrService } from 'ngx-toastr';
import { TestCase } from '../model';
import { Subscription } from 'rxjs';
import { LoadingComponent } from "../loading/loading.component";


@Component({
  selector: 'app-testcases',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent],
  templateUrl: './testcases.component.html',
  styleUrl: './testcases.component.css',
  animations:[]
})
export class TestcasesComponent implements OnInit {
  
  constructor(private apiService: TestCasesService,private toastr:ToastrService) {
  }

  testCases: TestCase[] = [];
  isDataLoading = false;


  ngOnInit(): void {
    // Initialize multiple test cases
    this.getAllTestCases();
  }
  getAllTestCases(){
    this.isDataLoading = true;
    this.apiService.getAllTestCases().subscribe(
      (response:any) => {
        this.isDataLoading = false;
        this.testCases = response;
      },
      (error:any) => {
        this.isDataLoading = false;
      }
    );
  }
  onRunButtonClick(testCase: TestCase): void {
    
    // Simulate API call or run the test case
    if(testCase.id === 1){
      this.apiService.runTestProfile(localStorage.getItem("user")??"",testCase).subscribe(
        (response:any) => {
          console.log(`${testCase.name} completed successfully`, response);
          this.getAllTestCases();
          this.toastr.info(`${testCase.name} completed successfully`)
        },
        (error:any) => {
          console.error(`${testCase.name} failed`, error);
          this.getAllTestCases();
          this.toastr.info(`${testCase.name} completed successfully`)
        }
        
      );
    } else if(testCase.id === 2){
      this.apiService.runTestChat(localStorage.getItem("user")??"").subscribe(
        (response) => {
          console.log(`${testCase.name} completed successfully`, response);
          this.getAllTestCases();
          this.toastr.info(`${testCase.name} completed successfully`)
        },
        (error) => {
          console.error(`${testCase.name} failed`, error);
          this.getAllTestCases();
          this.toastr.info(`${testCase.name} completed successfully`)
        }
      );
    }else{
      // testCase.isLoading = false;
      this.toastr.info("TEST CASE NOT FOUND");
    }
  }
}
