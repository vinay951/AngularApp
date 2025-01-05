import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TestCasesService } from '../service/run/test-cases.service';
import {ToastrService } from 'ngx-toastr';
import { TestCase } from '../model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-testcases',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './testcases.component.html',
  styleUrl: './testcases.component.css',
  animations:[]
})
export class TestcasesComponent implements OnInit {
  
  constructor(private apiService: TestCasesService,private toastr:ToastrService) {
  }

  testCases: TestCase[] = [];


  ngOnInit(): void {
    // Initialize multiple test cases
    this.apiService.testCases$.subscribe(
      (testCases) => {
        console.log('Test cases received:', testCases);
        this.testCases = testCases;
      },
      (error) => {
        console.error('Error subscribing to test cases:', error);
      }
    );
  }

  onRunButtonClick(testCase: TestCase): void {
    // Start loading spinner for the specific test case
    this.setTrueForTestCases(testCase);
    // Simulate API call or run the test case
    if(testCase.id === 1){
      this.apiService.runTestProfile(localStorage.getItem("user")??"").subscribe(
        (response:any) => {
          console.log(`${testCase.name} completed successfully`, response);
          this.setFalseForTestCases(testCase);
          this.toastr.info(`${testCase.name} completed successfully`)
        },
        (error:any) => {
          console.error(`${testCase.name} failed`, error);
          this.setFalseForTestCases(testCase);
          this.toastr.info(`${testCase.name} completed successfully`)
        }
        
      );
    } else if(testCase.id === 2){
      this.apiService.runTestChat(localStorage.getItem("user")??"").subscribe(
        (response) => {
          console.log(`${testCase.name} completed successfully`, response);
          this.setFalseForTestCases(testCase);
        },
        (error) => {
          console.error(`${testCase.name} failed`, error);
          this.setFalseForTestCases(testCase);
        }
      );
    }else{
      // testCase.isLoading = false;
      this.toastr.info("TEST CASE NOT FOUND");
      this.setFalseForTestCases(testCase);
    }
  }
  setTrueForTestCases(testCase:TestCase){
    this.testCases.forEach((element,i) => {
      if(element.id === testCase.id){
        this.apiService.setLoadingState(element.id,true);
      } 
    });
  } 
  setFalseForTestCases(testCase:TestCase){
    this.testCases.forEach((element,i) => {
      if(element.id === testCase.id){
        this.apiService.setLoadingState(element.id,false);
      }
    });
  }
}
