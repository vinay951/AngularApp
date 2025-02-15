import { AfterViewInit, Injectable, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session/session.service';
import { HomeComponent } from './home/home.component';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {



  private apiUrl = 'https://dialogflow.googleapis.com/v2/projects/pizzadelivery-yflisb/agent/sessions/4166c918-747d-e25d-60bc-d3151584f369:detectIntent';
  
  constructor(private http: HttpClient,private route:Router,private session:SessionService) {}
  

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
    if(message.toLocaleLowerCase().includes("login")){
      let validate:Boolean = confirm("routing to login page")
      if(validate){
        this.route.navigateByUrl('/login');
        reply = "routed to login page";
      }
      if(localStorage.getItem('user')){
        reply = "You are already logged in";
      }
    }else if(message.toLocaleLowerCase().includes("logout")){
      let validate:Boolean = confirm("Do you want to logout")
      if(validate){
        localStorage.clear();
        this.session.clearSessionData();
        reply = "You are successfully logged out";
      }
    } else if(message.toLocaleLowerCase().includes("home")){
      let validate:Boolean = confirm("routing to home page")
      if(validate){
        this.route.navigateByUrl('/home');
        reply = "routed to home page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access home page";
      }
    }else if(message.toLocaleLowerCase().includes("chat")){
      let validate:Boolean = confirm("routing to Chat Gpt page")
      if(validate){
        this.route.navigateByUrl('/chatgpt');
        reply = "routed to Chat Gpt page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access Chat gpt page";
      }
    }else if(message.toLocaleLowerCase().includes("password")){
      let validate:Boolean = false;
      let page = '';
      if(!localStorage.getItem('user')){
        validate = confirm("routing to forgot Password page");
        page = "/forgot";
        reply = "routed to forgot Password page";
      } else{
        validate = confirm("routing to Change Password page");
        page = "/profile";
        reply = "routed to profile page";
      }
      if(validate){
        this.route.navigateByUrl(page);
      }
    }else if(message.toLocaleLowerCase().includes("create") || message.toLocaleLowerCase().includes("register")){
      let validate:Boolean = confirm("routing to create user page")
      if(validate){
        this.route.navigateByUrl('/register');
        reply = "routed to create user page";
      }
    }else if(message.toLocaleLowerCase().includes("compiler") || message.toLocaleLowerCase().includes("online")){
      let validate:Boolean = confirm("routing to online compiler page")
      if(validate){
        this.route.navigateByUrl('/compiler');
        reply = "routed to online compiler page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access Chat gpt page";
      }
    } else if(message.toLocaleLowerCase().includes("prediction") || message.toLocaleLowerCase().includes("predict")){
      let validate:Boolean = confirm("routing to Bike Buyer Prediction page")
      if(validate){
        this.route.navigateByUrl('/predict');
        reply = "routed to Bike Buyer Prediction page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access Chat gpt page";
      }
    }else if(message.toLocaleLowerCase().includes("profile") || message.toLocaleLowerCase().includes("profile")){
      let validate:Boolean = confirm("routing to Profile page")
      if(validate){
        this.route.navigateByUrl('/profile');
        reply = "routed to Profile page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access Chat gpt page";
      }
    }else if(message.toLocaleLowerCase().includes("strange") || message.toLocaleLowerCase().includes("strange")){
      let validate:Boolean = confirm("routing to strange page")
      if(validate){
        this.route.navigateByUrl('/strange');
        reply = "routed to strange page";
      }
      if(!localStorage.getItem('user')){
        reply = "Login First to access Chat gpt page";
      }
    } else{
      reply = "Router Bot is not able to understand the message";
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

