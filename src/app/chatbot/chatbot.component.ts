import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  userMessage: string = '';
  botMessages: string[] = [];
  isChatOpen: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.botMessages.push(`You: ${this.userMessage}`);
      this.chatbotService.sendMessage(this.userMessage).subscribe((response: any) => {
        this.botMessages.push(`Bot: ${response.reply}`);
        this.userMessage = '';
      });
    }
  }
}


