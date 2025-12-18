import { Component } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports:[CommonModule,ReactiveFormsModule,FormsModule]
})
export class ChatComponent {
  messages: any[] = [];
  userMessage: string = '';
  isLoading: boolean = false;

  constructor(private chatService: ChatService) {}

  async sendMessage() {
    if (!this.userMessage.trim()) {
      return;
    }

    const userMsg = this.userMessage;
    this.messages.push({ text: userMsg, sender: 'user' });
    this.userMessage = ''; // Clear the input field

    this.isLoading = true;

    try {
      const botResponse = await this.chatService.sendMessage(userMsg);
      this.messages.push({ text: botResponse, sender: 'bot', isHtml: true });
    } catch (error) {
      console.error('Error sending message:', error);
      this.messages.push({ text: 'Sorry, something went wrong.', sender: 'bot' });
    } finally {
      this.isLoading = false;
    }
  }
  clearChat(){
    this.chatService.clearHistory();
    this.messages = [];
  }
}
