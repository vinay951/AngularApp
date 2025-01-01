import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WebsocketService } from '../service/websocket/websocket.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';
import { LoadingComponent } from "../loading/loading.component";
import { interval } from 'rxjs';
import { IdleDetectionService } from '../service/idle/idle-detection.service';

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
  onlineUsers:number = 0;
  activeOnlineUsers: string[] = [];
  isOnlineUsersVisible = false;

  constructor( private router: Router,
    private websocketService:WebsocketService,
    private toastr:ToastrService,
    private userService:UserService,
    private idleService:IdleDetectionService
  ){

  }
  ngOnInit(): void {
    this.idleService.strartTracking();
    this.getUserName();
    this.loadMessages();
    this.websocketService.messages$.subscribe(message => {
      if (message) {
        // Log and add the received message to the array of messages
        console.log(`Message received from ${message.sender}: ${message.content}`);
        if(this.username != message.sender){
          this.toastr.info(`Message received from ${message.sender}: ${message.content}`);
        }
        this.messages.push(message);
        this.saveMessages();
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
    this.websocketService.onlineUsers$.subscribe((count) => {
      this.onlineUsers = count;  // Update the active user count
    });

    this.websocketService.activeOnlineUsers$.subscribe((count) => {
      this.activeOnlineUsers = count;  // Update the active user
    });
  }
  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
  loadMessages(): void {
    // Fetch previous messages from local storage
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      this.messages = JSON.parse(storedMessages);  // Parse and load messages into the array
    }
  }
  saveMessages(): void {
    // Save the current chat messages to local storage
    localStorage.setItem('chatMessages', JSON.stringify(this.messages));
  }

  connect(){
    this.isDataLoading = true;
    this.websocketService.connect(this.username).then(()=>{
      this.isDataLoading = false;
    }).catch((error)=>{
      console.log(error);
      this.isDataLoading = false;
    });
  }
  send(){
    this.isDataLoading = true; // Show the loading spinner

    if (this.message) {
      this.websocketService.sendMessage(this.username, this.message)
        .then(() => {
          // Message sent successfully
          this.message = '';  // Clear the message input
          this.isDataLoading = false;  // Hide the loading spinner
        })
        .catch((error) => {
          // Handle errors (e.g., WebSocket disconnected)
          console.error(error);
          this.isDataLoading = false;  // Hide the loading spinner
        });
    } else {
      this.isDataLoading = false;  // Hide the loading spinner if no message is entered
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
  showOnlineUsers(show: boolean): void {
    console.log("ssss",this.activeOnlineUsers);
    this.isOnlineUsersVisible = show;
  }
}
