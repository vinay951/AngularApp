import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestCasesService } from '../service/run/test-cases.service';
import {ToastrService } from 'ngx-toastr';
import { TestCase } from '../model';
import { LoadingComponent } from "../loading/loading.component";
import { interval, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TestRegisterComponent } from '../test-register/test-register.component';


@Component({
  selector: 'app-testcases',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingComponent,DragDropModule],
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
    }else if(testCase.id === 3){
      this.apiService.runTestOnlineCompiler(localStorage.getItem("user")??"").subscribe(
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
    }
    else{
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
 // Handle the drop event for reordering test cases
 onDrop(event: CdkDragDrop<TestCase[]>) {
  const draggedTestCase = event.item.data;
  if (draggedTestCase) {
    const previousIndex = this.testCases.findIndex(
      (testCase) => testCase === draggedTestCase
    );
    const currentIndex = event.currentIndex;

    // Move the item to the new position
    const movedTestCase = this.testCases[previousIndex];
    this.testCases.splice(previousIndex, 1);
    this.testCases.splice(currentIndex, 0, movedTestCase);
  } else {
    console.error('Dragged item data is null or undefined');
  }
}

// Handle the drop event in the delete area (deletion logic)
onDeleteDrop(event: CdkDragDrop<TestCase[]>) {
  // Log the event to check its structure
  console.log('onDeleteDrop called', event);

  const draggedTestCase = event.item.data;  // Get the dragged test case
  if (draggedTestCase) {
    const isDropInDeleteArea = true;  // Check if drop happened in delete area

    if (isDropInDeleteArea) {
      const confirmed = window.confirm(`Are you sure you want to delete ${draggedTestCase.name}?`);
      if (confirmed) {
        this.deleteTestCase(draggedTestCase);  // Call the deletion method
      }
    } else {
      console.log('Dropped outside the delete area, no deletion');
    }
  } else {
    console.error('Dragged item data is null or undefined');
  }
}


  // API call for the dropped test case
  deleteTestCase(testCase: TestCase) {
    this.isDataLoading = true;
    this.apiService.dropTestCase(testCase).subscribe(
      (response:any) => {
        if(response.responseMessage === 'Success'){
          this.toastr.success("Test Case Deleted");
        }else{
          this.toastr.success("you Can't delete this Test Case")
        }
        this.isDataLoading = false;
      },
      (error) => {
        this.toastr.error("Error Occured While Deleting")
        this.isDataLoading = false;
      }
    );
  }
  onDragStarted(testCase: any) {
    // Logic when drag starts (e.g., add a class or style)
    console.log('Drag started for', testCase.name);
  }
  
  onDragEnded(testCase: any) {
    // Logic when drag ends (e.g., remove any extra classes or reset state)
    console.log('Drag ended for', testCase.name);
  }
}
