import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'https://dialogflow.googleapis.com/v2/projects/pizzadelivery-yflisb/agent/sessions/4166c918-747d-e25d-60bc-d3151584f369:detectIntent';
  
  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${123}`,
      'Content-Type': 'application/json',
    });

    const body = {
      queryInput: {
        text: {
          text: message,
          languageCode: 'en-US',
        },
      },
    };
    const payload = { message };
    return this.getRandomObservable();
  }

  // A list of observables (can be any type of observable)
  observablesList: Observable<any>[] = [
    of('First Observable').pipe(delay(1000)),
    of('Second Observable').pipe(delay(1500)),
    of('Third Observable').pipe(delay(500)),
    of('Fourth Observable').pipe(delay(1200)),
  ];


  // Function to return a random Observable from the list
  getRandomObservable(): Observable<any> {
    const randomIndex = Math.floor(Math.random() * this.observablesList.length);
    return this.observablesList[randomIndex];
  }
}

