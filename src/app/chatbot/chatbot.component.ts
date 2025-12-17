import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatbotService } from '../chatbot.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  userMessage: string = '';
  botMessages: string[] = [];
  isChatOpen: boolean = false;
  isLoading: boolean = false;
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService) {}

  onEnter(): void {
    if (!this.isLoading) {
      this.sendMessage();
    }
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (this.userMessage.trim()) {
      this.botMessages.push(`You: ${this.userMessage}`);
      // scroll after adding user's message
      setTimeout(() => this.scrollToBottom(), 0);
      this.isLoading = true;
      this.chatbotService.sendMessage(this.userMessage).subscribe((response: any) => {
        // response is expected to be an object { route, reply, raw }
        const text = (response && (response.reply || response.raw)) ? (response.reply || response.raw) : JSON.stringify(response);
        this.botMessages.push(`Bot: ${text}`);
        this.userMessage = '';
        this.isLoading = false;
        // scroll after bot response arrives
        setTimeout(() => this.scrollToBottom(), 0);
      }, (error: any) => {
        this.botMessages.push(`Bot: Error receiving response`);
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 0);
      });
    }
  }

  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer.nativeElement;
      // Prefer scrolling the last message into view for a smooth effect
      const lastMsg = container.querySelector('.message:last-child');
      if (lastMsg && lastMsg.scrollIntoView) {
        try {
          lastMsg.scrollIntoView({ behavior: 'smooth', block: 'end' });
        } catch (e) {
          // some browsers may throw for unsupported options; fall back
          lastMsg.scrollIntoView();
        }
      } else {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      // ignore
    }
  }
}


