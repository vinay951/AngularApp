import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private messageQueue: any[] = []; 

  stompClient: Client | null = null;  // STOMP client instance to handle WebSocket connection

  // Subject to manage the stream of incoming messages
  private messageSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messageSubject.asObservable();  // Observable for components to subscribe to messages
  private onlineUsersSubject = new BehaviorSubject<number>(0);  // Holds the count of active users
  private activeOnlineUsersSubject = new BehaviorSubject<string[]>([]);


  // Subject to track the connection status (connected/disconnected)
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionSubject.asObservable();  // Observable for components to track connection status

  public onlineUsers$ = this.onlineUsersSubject.asObservable();

  public activeOnlineUsers$ = this.activeOnlineUsersSubject.asObservable();

  constructor() { 
  }
  connect(username:string):Promise<void>{
    return new Promise((resolve, reject) => {
      const socket = new SockJS('https://backend-1055536593121.us-central1.run.app/ws');  // Initialize the SockJS WebSocket connection to the server

    // Configure the STOMP client with connection details
    this.stompClient = new Client({
      webSocketFactory: () => socket,  // Use SockJS as the WebSocket factory
      reconnectDelay: 1500,  // Delay of 5 seconds before attempting to reconnect if connection is lost
      heartbeatIncoming: 300000,  // 5 minutes heartbeat interval from the server to the client (300000ms)
      heartbeatOutgoing: 300000,   // Reconnect delay if connection is lost
      debug: (str) => console.log(str)  // Log STOMP debug messages for troubleshooting
    });

    // On successful connection
    this.stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket server');
      this.connectionSubject.next(true);  // Notify that the connection is successful

      // Subscribe to the '/topic/public topic to receive public messages
      this.stompClient?.subscribe('/topic/public', (message: Message) => {
        this.messageSubject.next(JSON.parse(message.body));  // Pass the message to subscribers
      });
      this.stompClient?.subscribe('/topic/onlineUsers', (message: Message) => {
        const onlineUsers = JSON.parse(message.body);
        this.onlineUsersSubject.next(onlineUsers);  // Update the online users list
      });
      this.stompClient?.subscribe('/topic/activeOnlineUsers', (message: Message) => {
        const activateOnlineUsers = JSON.parse(message.body);
        this.activeOnlineUsersSubject.next(activateOnlineUsers);  // Update the online users list
      });

      // Send a "JOIN" message to notify the server that a user has joined
      this.stompClient?.publish({
        destination: '/app/chat.addUser',  // Server endpoint for adding users
        body: JSON.stringify({ sender: username, type: 'JOIN' })  // Send username and join event
      });
      resolve();
    };
    // Handle errors reported by the STOMP broker
    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);  // Log the error message
      console.error('Additional details: ' + frame.body);  // Log additional error details
      this.connectionSubject.next(false);
      reject("not connected");
    };
    this.stompClient?.activate();
    });
  }

  sendMessage(username:string,content:string): Promise<void>{
    return new Promise((resolve, reject) => {
      const chatMessage = { sender: username, content: content, type: 'CHAT' };
      if (this.stompClient && this.stompClient.connected) {
        // Create a chat message object
  
        // Log the message being sent and the sender
        console.log(`Message sent by ${username}: ${content}`);
  
        // Publish (send) the message to the '/app/chat.sendMessage' destination
        try{
          this.stompClient.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(chatMessage)  // Convert the message to JSON and send
          });
          resolve();
        } catch(error){
          reject(error);
        }
      } else {
        // Log an error if the WebSocket connection is not active
        console.error('WebSocket is not connected. Unable to send message.');
        console.error('WebSocket is not connected. Queuing message...');
        this.messageQueue.push(chatMessage);  // Queue the message
        // Attempt to reconnect and send queued messages once the connection is established
        this.connect(username).then(() => {
          // Once connected, process the queue and send the message
          this.sendPendingMessages().then(()=>{
            resolve();
          }).catch((error)=>{
            reject(error);
          });
          resolve();  // Resolve once the message is successfully queued and sent
        }).catch((error) => {
          // In case of reconnection failure, reject the promise
          console.error('Reconnection failed:', error);
          reject(error);
        });
      }
    });
  }

  disconnect(){
    if(this.stompClient){
      this.stompClient.deactivate();
    }
    
  }
  // Send all pending messages once the WebSocket is connected
  private sendPendingMessages(): Promise<void> {
    return new Promise((resolve,reject)=>{
      if (this.stompClient && this.stompClient.connected) {
        console.log('Sending pending messages...');
        while (this.messageQueue.length > 0) {
          const message = this.messageQueue.shift();  // Get the next message
          if (message) {
            // Send the message if WebSocket is connected
            this.stompClient.publish({
              destination: '/app/chat.sendMessage',
              body: JSON.stringify(message)
            });
            console.log(`Sent queued message: ${message.content}`);
          }
        }
        resolve();
      } else {
        console.log('WebSocket is not yet connected. Retrying...');
        reject('WebSocket is not yet connected. Retrying...');
      }
    });
  }
}
