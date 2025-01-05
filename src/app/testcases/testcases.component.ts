import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestCasesService } from '../service/run/test-cases.service';
import {ToastrService } from 'ngx-toastr';
import { TestCase } from '../model';
import { LoadingComponent } from "../loading/loading.component";
import { interval, take } from 'rxjs';


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
    interval(10000).pipe(take(5)).subscribe(() => {
       // Method called every second
       this.getAllTestCasesWithoutLoad();
    });
  }
  getAllTestCasesWithoutLoad(){
    
    this.apiService.getAllTestCases().subscribe(
      (response:any) => {
        
        this.testCases = response;
      },
      (error:any) => {
        
      }
    );
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
    this.setTrue(testCase);
    this.setTestCases(testCase);
    // Simulate API call or run the test case
    if(testCase.id === 1){
      this.apiService.runTestProfile(localStorage.getItem("user")??"").subscribe(
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
  loadingForMuchTime(test:TestCase){
    this.isDataLoading = true;
    this.apiService.stopTest(test).subscribe(
      (response) => {
        this.getAllTestCases();
        this.isDataLoading = false;
      },
      (error) => {
        this.getAllTestCases();
        this.isDataLoading = false;
      }
    );

  }
  setTrue(testCase:TestCase){
    this.testCases.forEach((element,i) => {
      if(element.id === testCase.id){
        this.testCases[i].loading = true;
      } 
    });
  }
  setTestCases(test:TestCase){
    this.apiService.setTestCases(test).subscribe(
      (response) => {
        
      },
      (error) => {
       
      }
    );
  }
}
