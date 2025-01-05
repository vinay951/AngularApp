import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TestCase } from '../../model';
@Injectable({
  providedIn: 'root'
})
export class TestCasesService {

  apiUrl = "https://selenium-testing-1055536593121.us-central1.run.app";


  // Declare and initialize the BehaviorSubject
  private testCasesSubject = new BehaviorSubject<TestCase[]>([]);

  constructor(private http:HttpClient) {
    this.setvalues();
  }

  // Observable to emit current test cases
  public testCases$ = this.testCasesSubject.asObservable();

  // Method to update the loading state of a specific test case
  setLoadingState(id: number, isLoading: boolean): void {
    const updatedTestCases = this.testCasesSubject.value.map((testCase) =>
      testCase.id === id ? { ...testCase, isLoading } : testCase
    );

    // Emit the updated test case list to subscribers
    this.testCasesSubject.next(updatedTestCases);

    // Persist updated test cases in localStorage
    localStorage.setItem('testCases', JSON.stringify(updatedTestCases));
  }
  setvalues(){
    // Default test cases in case localStorage doesn't provide valid data
    const storedTestCases = localStorage.getItem('testCases');
    let initialTestCases: TestCase[];

    try {
      initialTestCases = storedTestCases ? JSON.parse(storedTestCases) : [
        { id: 1, name: 'Profile Test Case', isLoading: false },
          { id: 2, name: 'Chat Test Case', isLoading: false },
          { id: 3, name: '# Test Case', isLoading: false },
          { id: 4, name: '# Test Case', isLoading: false }
      ];
    } catch (e) {
      // Fallback in case of an error parsing the stored test cases
      initialTestCases = [
        { id: 1, name: 'Profile Test Case', isLoading: false },
          { id: 2, name: 'Chat Test Case', isLoading: false },
          { id: 3, name: '# Test Case', isLoading: false },
          { id: 4, name: '# Test Case', isLoading: false }
      ];
      console.error('Error parsing storedTestCases:', e);
    }
    this.testCasesSubject.next(initialTestCases);
  }  
  runTestProfile(email:string){
    return this.http.get<any[]>(this.apiUrl+"/test/profile/"+email);
  }
  runTestChat(email:string){
    return this.http.get<any[]>(this.apiUrl+"/test/chat/"+email);
  }
}
