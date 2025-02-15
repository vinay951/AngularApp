import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'https://dialogflow.googleapis.com/v2/projects/pizzadelivery-yflisb/agent/sessions/4166c918-747d-e25d-60bc-d3151584f369:detectIntent';
  
  constructor(private http: HttpClient,private route:Router) {}

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
    let reply ='';
    if(message.includes("login")){
      let validate:Boolean = confirm("routing to login page")
      if(validate){
        this.route.navigateByUrl('/login');
        reply = "routed to login page";
      }
      if(localStorage.getItem('user')){
        reply = "You are already logged in";
      }
    }else if(message.includes("logout")){
      let validate:Boolean = confirm("Do you want to logout")
      if(validate){
        localStorage.removeItem('user');
        reply = "You are successfully logged out";
      }
    } else if(message.includes("home")){
      let validate:Boolean = confirm("routing to home page")
      if(validate){
        this.route.navigateByUrl('/home');
        reply = "routed to home page";
      }
    } else{
      reply = "beta version need some more time to understand ur question";
    }
    return this.getRandomObservable(reply);
  }

  // A list of observables (can be any type of observable)
  observablesList: Observable<any> = of('ok').pipe(delay(500));


  // Function to return a random Observable from the list
  getRandomObservable(reply:string): Observable<any> {
   
    return of(reply).pipe(delay(500));
  }
}

