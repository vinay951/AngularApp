import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { TestCasesService } from '../service/run/test-cases.service';
import { ToastrService } from 'ngx-toastr';

interface TestCase {
  id: number;
  name: string;
  isLoading: boolean;
}

@Component({
  selector: 'app-testcases',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './testcases.component.html',
  styleUrl: './testcases.component.css'
})
export class TestcasesComponent implements OnInit {
  

  constructor(private apiService: TestCasesService, private router: Router,private toastr:ToastrService) {}

  testCases: TestCase[] = [];
  isRouteChanging: boolean = false;  // To handle routing issues


  ngOnInit(): void {
    // Initialize multiple test cases
    this.testCases = [
      { id: 1, name: 'Profile Test Case', isLoading: false },
      { id: 2, name: 'Chat With World Test Case', isLoading: false },
      { id: 3, name: '# Test Case', isLoading: false },
      { id: 4, name: '# Test Case', isLoading: false }
    ];

    // Listen to route events to prevent spinner from stopping during routing
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isRouteChanging = true;
      }
      if (event instanceof NavigationEnd) {
        this.isRouteChanging = false;
      }
    });
  }

  onRunButtonClick(testCase: TestCase): void {
    // Start loading spinner for the specific test case
    testCase.isLoading = true;

    // Simulate API call or run the test case
    if(testCase.id === 1){
      this.apiService.runTestProfile(localStorage.getItem("user")??"").subscribe(
        (response) => {
          console.log(`${testCase.name} completed successfully`, response);
          // Stop loading spinner when test case completes
          testCase.isLoading = false;
          this.toastr.info(`${testCase.name} completed successfully`)
        },
        (error) => {
          console.error(`${testCase.name} failed`, error);
          // Stop loading spinner even if there's an error
          testCase.isLoading = false;
          this.toastr.info(`${testCase.name} completed successfully`)
        }
        
      );
    } else if(testCase.id === 2){
      this.apiService.runTestChat(localStorage.getItem("user")??"").subscribe(
        (response) => {
          console.log(`${testCase.name} completed successfully`, response);
          // Stop loading spinner when test case completes
          testCase.isLoading = false;
          this.toastr.info(`${testCase.name} completed successfully`)
        },
        (error) => {
          console.error(`${testCase.name} failed`, error);
          // Stop loading spinner even if there's an error
          testCase.isLoading = false;
          this.toastr.info(`${testCase.name} completed successfully`)
        }
      );
    }else{
      testCase.isLoading = false;
      this.toastr.info(`${testCase.name} not found`)
    }
  }
}
