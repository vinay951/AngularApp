import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiKey: string = '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'; // Replace with your OpenAI API key
  private messagesHistory: { role: string; content: string }[] = []; // Store conversation history here

  constructor() {}

  async sendMessage(message: string): Promise<string> {
    let retries = 0;
    const maxRetries = 5;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Add the user message to the conversation history
    this.messagesHistory.push({ role: 'user', content: message });

    while (retries < maxRetries) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',  // or 'gpt-4' depending on your access
            messages: this.messagesHistory,  // Use the entire conversation context
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Get the assistant's reply and add it to the conversation history
        const reply = response.data.choices[0].message.content.trim();
        this.messagesHistory.push({ role: 'assistant', content: reply }); // Append assistant's response

        return reply;
      } catch (error: any) {
        if (error.response && error.response.status === 429) {
          // Retry logic on hitting rate limit
          retries++;
          const rateLimitRemaining = error.response.headers['x-ratelimit-remaining'];
          const rateLimitReset = error.response.headers['x-ratelimit-reset'] * 1000;
          const currentTime = Date.now();
          const waitTime = Math.max(rateLimitReset - currentTime, 1000); // Wait until rate limit reset

          console.error(`Rate limit exceeded. Retrying in ${waitTime} ms...`);

          // Wait before retrying (backoff)
          await delay(waitTime);
        } else {
          console.error('Error communicating with OpenAI API:', error);
          throw new Error('Failed to get a response from ChatGPT');
        }
      }
    }

    throw new Error('Max retries exceeded due to rate limits');
  }

  // Optionally, you can expose a method to clear the message history if needed
  clearHistory() {
    this.messagesHistory = [];
  }
}
