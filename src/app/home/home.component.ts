import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketService } from '../service/websocket/websocket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: string = '';  // Stores the username entered by the user
  message: string = '';  // Stores the message being typed by the user
  messages: any[] = [];  // Stores all the chat messages
  isConnected = false;  // Tracks whether the user is connected to the WebSocket
  connectingMessage = 'Connecting...';
  isDataLoading = false;

  constructor( private router: Router,
    private websocketService:WebsocketService,
    private toastr:ToastrService,
    private userService:UserService
  ){

  }
  ngOnInit(): void {
    this.getUserName()
    this.websocketService.messages$.subscribe(message => {
      if (message) {
        // Log and add the received message to the array of messages
        console.log(`Message received from ${message.sender}: ${message.content}`);
        if(this.username != message.sender){
          this.toastr.info(`Message received from ${message.sender}: ${message.content}`);
        }
        this.messages.push(message);
      }
    });

    // Subscribe to connection status observable to monitor connection status
    this.websocketService.connectionStatus$.subscribe(connected => {
      this.isConnected = connected;  // Update the connection status
      if (connected) {
        this.connectingMessage = '';  // Clear the connecting message once connected
        console.log('WebSocket connection established');
      }
    });

  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  connect(){
    console.log('Attempting to connect to WebSocket at https://backend-1055536593121.us-central1.run.app/ws with username:', this.username);
    this.websocketService.connect(this.username);
  }
  send(){
    if (this.message) {
      this.isDataLoading = true;
      this.websocketService.sendMessage(this.username, this.message);  // Send the message via WebSocket service
      this.message = '';  // Clear the message input after sending
      this.isDataLoading = false;
    }
  }
  getAvatarColor(sender:string):string{

    // Array of colors to choose from
    const colors = ['#2196F3', '#32c787', '#00BCD4', '#ff5652', '#ffc107', '#ff85af', '#FF9800', '#39bbb0'];
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
      // Generate a hash from the sender's name
      hash = 31 * hash + sender.charCodeAt(i);  // Create a hash based on the username
    }
    // Return a color from the array based on the hash value
    return colors[Math.abs(hash % colors.length)];
  }
  getUserName(){
    this.isDataLoading = true;
    this.userService.getUserProfile(localStorage.getItem("user")).subscribe(
      (data:any) => {
        this.username = data.firstName;
        this.isDataLoading = false;
      },
      (error:any) => {
        console.error('Error loading user data', error);
        this.isDataLoading = false;
      }
    );
  }
  
}
